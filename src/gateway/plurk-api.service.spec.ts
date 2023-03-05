import { ConfigService } from '@nestjs/config';
import type { PlurkClient } from 'plurk2';
import { FilterType } from '../dto/filter-type.enum';
import { mockApiResponse } from './constants';
import { PlurkApiService } from './plurk-api.service';
import { PlurksSerializer } from './plurks.serializer';

describe('PlurkApiService', () => {
  const mockAuth = { token: 'this is a token', secret: 'this is the secret' };
  const empty = '';

  let configService: ConfigService;
  let serializer: PlurksSerializer;
  let plurkApi: PlurkClient;
  let plurkApiService: PlurkApiService;

  beforeAll(async() => {
    configService = new ConfigService();
    serializer = new PlurksSerializer();
    jest.spyOn(configService, 'getOrThrow').mockImplementation((...args) => empty);

    plurkApiService = new PlurkApiService(configService, serializer);
    plurkApi = plurkApiService.plurkApi;
  });

  beforeEach(async() => {
    jest.spyOn(plurkApi, 'request').mockResolvedValue(mockApiResponse);
  });

  describe('getTimelinePlurks', () => {
    it('should call /Timeline/getPlurks with given properties', async() => {
      // given
      const url = '/Timeline/getPlurks';
      const filter = FilterType.NONE;
      let offset;
      jest.spyOn(plurkApiService, 'sendRequest');

      // when
      await plurkApiService.getTimelinePlurks(mockAuth, filter, offset);

      // then
      const params = {
        limit: 10,
        minimal_data: true,
        minimal_user: true,
      };
      expect(plurkApiService.sendRequest).toBeCalledWith(mockAuth, url, params);

      // cleanup
      jest.clearAllMocks();
    });

    it('should send request with offset if given', async() => {
      const url = '/Timeline/getPlurks';
      // given
      const filter = FilterType.FAVORITE;
      let offset;
      jest.spyOn(plurkApiService, 'sendRequest');

      // when
      await plurkApiService.getTimelinePlurks(mockAuth, filter, offset);

      // then
      const params = {
        // fixed
        limit: 10,
        minimal_data: true,
        minimal_user: true,
        // given
        filter: 'favorite',
      };
      expect(plurkApiService.sendRequest).toBeCalledWith(mockAuth, url, params);

      // cleanup
      jest.clearAllMocks();
    });

    it('should request with filter if given', async() => {
      // given
      const url = '/Timeline/getPlurks';
      const filter = FilterType.NONE;
      const offset = '2023-03-05T00:00:00.000Z';
      jest.spyOn(plurkApiService, 'sendRequest');

      // when
      await plurkApiService.getTimelinePlurks(mockAuth, filter, offset);

      // then
      const params = {
        // fixed
        limit: 10,
        minimal_data: true,
        minimal_user: true,
        // given
        offset,
      };
      expect(plurkApiService.sendRequest).toBeCalledWith(mockAuth, url, params);

      // cleanup
      jest.clearAllMocks();
    });
  });

  describe('sendRequest', () => {
    it('should reset auth after each request', async() => {
      // given
      const url = '/App/Users/me';
      // when
      await plurkApiService.sendRequest(mockAuth, url, {});
      // then
      expect(plurkApi.request).toHaveBeenCalled();
      expect(plurkApi.token).toBe(empty);
      expect(plurkApi.tokenSecret).toBe(empty);
    });
  });
});
