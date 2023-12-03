import { createMock, type DeepMocked } from '@golevelup/ts-jest';
import { BadGatewayException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { FilterType } from '@plurk-search/common/enum/FilterType';
import { PlurkClient } from 'plurk2';
import { AuthObject } from '~api/dataobject/AuthObject';

import { mockApiResponse } from './constants';
import { PlurkApiService } from './plurk-api.service';
import { PlurksSerializer } from './plurks.serializer';

describe('PlurkApiService', () => {
  let configService: DeepMocked<ConfigService>;
  let plurkApiService: PlurkApiService;
  let plurkApi: PlurkClient;

  const mockAuth = { token: 'this is a token', secret: 'this is the secret' };
  const empty = '';

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlurkApiService, PlurksSerializer],
    }).useMocker(createMock)
      .compile();

    configService = module.get(ConfigService);
    plurkApiService = module.get(PlurkApiService);
    plurkApi = plurkApiService.plurkApi;

    configService.getOrThrow.mockReturnValue(empty);
    jest.spyOn(plurkApi, 'request').mockResolvedValue(mockApiResponse);
    jest.spyOn(plurkApi, 'getRequestToken')
      .mockResolvedValue(new PlurkClient('request token', 'request secret', 'access token', 'access secret'));
    jest.spyOn(plurkApi, 'getAccessToken')
      .mockResolvedValue(new PlurkClient('request token', 'request secret', 'access token', 'access secret'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRequestToken', () => {
    it('should get auth info from Plurk App', async() => {
      // when
      const ret = await plurkApiService.getRequestToken();
      // then
      expect(ret.token).toBeDefined();
      expect(ret.token.length).toBeGreaterThan(0);
      expect(ret.secret).toBeDefined();
      expect(ret.secret.length).toBeGreaterThan(0);
      expect(ret.authPage).toBeDefined();
      expect(ret.authPage.length).toBeGreaterThan(0);
    });

    it('should capture failures', async() => {
      jest.spyOn(plurkApi, 'getRequestToken').mockImplementationOnce(() => {
        throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
      });
      await expect(plurkApiService.getRequestToken()).rejects.toThrow(BadGatewayException);
    });

    it('must reset authentication details before and after each request', async() => {
      jest.spyOn(plurkApiService, 'resetAuth');
      await plurkApiService.getRequestToken();
      expect(plurkApiService.resetAuth).toBeCalledTimes(2);
    });
  });

  describe('authenticate', () => {
    const auth = new AuthObject({ token: 'This is a token', secret: 'This is the secret' });
    const code = '1234';

    it('should get access token from Plurk App with given auth info', async() => {
      // given
      jest.spyOn(plurkApiService, 'setupAuth');
      // when
      const ret = await plurkApiService.authenticate(auth, code);
      // then
      expect(plurkApiService.setupAuth).toHaveBeenCalledWith(auth);
      expect(plurkApi.getAccessToken).toHaveBeenCalledWith(code);
      expect(ret).toBeInstanceOf(AuthObject);
      expect(ret.token).toBeDefined();
      expect(ret.token.length).toBeGreaterThan(0);
      expect(ret.secret).toBeDefined();
      expect(ret.secret.length).toBeGreaterThan(0);
    });

    it('should capture failures', async() => {
      // given
      jest.spyOn(plurkApi, 'getAccessToken').mockImplementationOnce(() => {
        throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
      });
      // then
      await expect(plurkApiService.authenticate(auth, code)).rejects.toThrow(BadRequestException);
    });

    it('must reset authentication details after each request', async() => {
      // given
      jest.spyOn(plurkApiService, 'setupAuth');
      // when
      await plurkApiService.authenticate(auth, code);
      // then
      expect(plurkApiService.resetAuth).toHaveBeenCalled();
    });
  });

  describe('getTimelinePlurks', () => {
    const requestUrl = '/Timeline/getPlurks';
    const noFilter = FilterType.NONE;
    const noOffset = undefined;
    const defaultParams = {
      limit: PlurkApiService.RESPONSE_PLURK_COUNT,
      minimal_data: true,
      minimal_user: true,
    };

    beforeEach(() => {
      jest.spyOn(plurkApiService, 'sendRequest');
    });

    it('should call /Timeline/getPlurks with default properties', async() => {
      await plurkApiService.getTimelinePlurks(mockAuth, noFilter, noOffset);
      expect(plurkApiService.sendRequest).toBeCalledWith(mockAuth, requestUrl, defaultParams);
    });

    it('should send request with filter if given', async() => {
      // given
      const filter = FilterType.FAVORITE;
      // when
      await plurkApiService.getTimelinePlurks(mockAuth, filter, noOffset);
      // then
      const params = {
        ...defaultParams,
        filter: 'favorite',
      };
      expect(plurkApiService.sendRequest).toBeCalledWith(mockAuth, requestUrl, params);
    });

    it('should request with offset if given', async() => {
      // given
      const offset = '2023-03-05T00:00:00.000Z';
      // when
      await plurkApiService.getTimelinePlurks(mockAuth, noFilter, offset);
      // then
      const params = {
        ...defaultParams,
        offset,
      };
      expect(plurkApiService.sendRequest).toBeCalledWith(mockAuth, requestUrl, params);
    });
  });

  describe('sendRequest', () => {
    it('should reset auth after each request', async() => {
      // given
      const url = '/App/Users/me';
      const params = {};
      // when
      await plurkApiService.sendRequest(mockAuth, url, params);
      // then
      expect(plurkApi.request).toHaveBeenCalledWith(url, params);
      expect(plurkApi.token).toBe(empty);
      expect(plurkApi.tokenSecret).toBe(empty);
    });
  });

  describe('setupAuth', () => {
    it('should setup plurkApi with given auth details', () => {
      // given
      plurkApi.token = '';
      plurkApi.tokenSecret = '';
      const auth = new AuthObject({ token: 'This is a token', secret: 'This is the secret' });
      // when
      plurkApiService.setupAuth(auth);
      // then
      expect(plurkApi.token).toBe(auth.token);
      expect(plurkApi.tokenSecret).toBe(auth.secret);
    });

    it('should not fail with empty auth', () => {
      const auth = new AuthObject();
      // when
      expect(() => { plurkApiService.setupAuth(auth); }).not.toThrowError();
    });
  });

  describe('resetAuth', () => {
    it('should reset auth information', () => {
      // given
      plurkApi.token = 'This is a token';
      plurkApi.tokenSecret = 'This is the secret';
      // when
      plurkApiService.resetAuth();
      // then
      expect(plurkApi.token).toBe('');
      expect(plurkApi.tokenSecret).toBe('');
    });
  });
});
