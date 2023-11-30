import { createMock, type DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { PlurkDto } from '@plurk-search/common/dto/Plurk';
import { PlurksDto } from '@plurk-search/common/dto/Plurks';
import { SearchResponseDto } from '@plurk-search/common/dto/SearchResponse';
import { FilterType } from '@plurk-search/common/enum/FilterType';
import { AuthService } from '~api/auth/auth.service';
import type { AuthDetail } from '~api/dataobject/AuthDetail';
import { PlurkApiService } from '~api/gateway/plurk-api.service';

import { SearchService } from './search.service';

describe('SearchService', () => {
  let searchService: SearchService;
  let authService: DeepMocked<AuthService>;
  let configService: DeepMocked<ConfigService>;
  let plurkApiService: DeepMocked<PlurkApiService>;

  const query = 'Search Query';
  const noOffset = undefined;
  const noFilter = FilterType.NONE;
  const token = 'This is a token';
  const credentials: AuthDetail = { token: 'this is a token', secret: 'this is the secret' };

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService],
    }).useMocker(createMock)
      .compile();

    searchService = module.get(SearchService);
    authService = module.get(AuthService);
    configService = module.get(ConfigService);
    plurkApiService = module.get(PlurkApiService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    configService.get.mockReturnValue('value');
  });

  describe('search', () => {
    beforeEach(() => {
      plurkApiService.getTimelinePlurks.mockResolvedValue(new PlurksDto());
    });

    it('should response SearchResultDto', async() => {
      await expect(searchService.search(token, query, noFilter, noOffset)).resolves
        .toBeInstanceOf(SearchResponseDto);
    });

    it('should verify token', async() => {
      await searchService.search(token, query, noFilter, noOffset);
      expect(authService.decryptAndVerify).toBeCalled();
    });

    it('should do nothing with invalid token', () => {
      authService.decryptAndVerify.mockImplementationOnce(token => { throw new BadRequestException(); });
      expect(plurkApiService.getTimelinePlurks).not.toBeCalled();
    });

    it('should request data with the given contraints', async() => {
      // given
      const filter = FilterType.FAVORITE;
      const offset = new Date('2023-03-04T00:00:00.000Z').toISOString();
      authService.decryptAndVerify.mockReturnValueOnce(credentials);
      // when
      await searchService.search(token, query, filter, offset);
      // then
      expect(plurkApiService.getTimelinePlurks).toBeCalledWith(credentials, filter, offset);
    });

    it('should add timestamp info in responses', async() => {
      // given
      const newestTimeStamp = '2023-03-04T00:00:00.000Z';
      const oldestTimeStamp = '2023-03-01T00:00:00.000Z';
      const latestPlurk = new PlurkDto({ postTime: new Date(newestTimeStamp) });
      const oldestPlurk = new PlurkDto({ postTime: new Date(oldestTimeStamp) });

      plurkApiService.getTimelinePlurks.mockResolvedValue(new PlurksDto({
        plurks: [latestPlurk, oldestPlurk],
      }));

      // when
      let response = await searchService.search(token, query, noFilter, noOffset);

      // then
      expect(response.firstTimestamp).toStrictEqual(new Date(newestTimeStamp));
      expect(response.firstTimestampStr).toBe(newestTimeStamp);
      expect(response.lastTimestamp).toStrictEqual(new Date(oldestTimeStamp));
      expect(response.lastTimestampStr).toBe(oldestTimeStamp);


      // given
      plurkApiService.getTimelinePlurks.mockResolvedValue(new PlurksDto({
        plurks: [],
      }));

      // when
      response = await searchService.search(token, query, noFilter, noOffset);

      // then
      expect(response.firstTimestamp).toBeUndefined();
      expect(response.firstTimestampStr).toBeUndefined();
      expect(response.lastTimestamp).toBeUndefined();
      expect(response.lastTimestampStr).toBeUndefined();
    });

    it('should filter results by queries', async() => {
      // given
      const plurkList = new PlurksDto({
        plurks: [
          { content: `A plurk that contains query ${query}.` }, // pass
          { content: 'A plurk that does not contains query.' }, // filtered
          { content: `${query} A plurk that contains query.` }, // pass
        ],
      });
      plurkApiService.getTimelinePlurks.mockResolvedValue(plurkList);
      // when
      const response = await searchService.search(token, query, noFilter, noOffset);
      // then
      expect(response.plurks).toHaveLength(2);
      expect(response.counts).toBe(2);
    });

    it('should generate next link in response', async() => {
      // given
      const newestTimeStamp = '2023-03-04T00:00:00.000Z';
      const oldestTimeStamp = '2023-03-01T00:00:00.000Z';
      const latestPlurk = new PlurkDto({ postTime: new Date(newestTimeStamp) });
      const oldestPlurk = new PlurkDto({ postTime: new Date(oldestTimeStamp) });
      plurkApiService.getTimelinePlurks.mockResolvedValue(new PlurksDto({
        plurks: [latestPlurk, oldestPlurk],
      }));
      // when
      const filter = FilterType.FAVORITE;
      const response = await searchService.search(token, query, filter, noOffset);
      // then
      expect(response.next).toBeDefined();
      expect(response.next).toContain(`offset=${oldestTimeStamp}`);
      expect(response.next).toContain(`query=${query}`);
      expect(response.next).toContain(`filter=${FilterType[filter]}`);
    });
  });

  describe('addPlurkToResponse', () => {
    it('should correctly push a plurk into response list and increase the count', () => {
      // given
      const plurk = new PlurkDto({ id: 1 });
      const response = new SearchResponseDto({
        plurks: [new PlurkDto({ id: 2 })],
        counts: 1,
      });
      // when
      SearchService.addPlurkToResponse(response, plurk);
      // then
      expect(response.counts).toBe(2);
      expect(response.plurks).toHaveLength(2);
      expect(response.plurks).toContain(plurk);
    });
  });
});
