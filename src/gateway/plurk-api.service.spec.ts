import { createMock, type DeepMocked } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { type PlurkClient } from 'plurk2';
import { FilterType } from '../dto/filter-type.enum';
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
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
});
