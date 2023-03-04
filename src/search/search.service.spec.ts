import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { FilterType } from '../dto/filter-type.enum';
import { PlurkDto } from '../dto/plurk.dto';
import { PlurksDto } from '../dto/plurks.dto';
import { SearchResponseDto } from '../dto/searchResponse.dto';
import { PlurkApiService } from '../gateway/plurk-api.service';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let app: TestingModule;
  let searchService: SearchService;
  const mockPlurkApiService = {
    getTimelinePlurks: jest.fn(),
  };
  const defaultOffset = undefined;

  beforeAll(async() => {
    app = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [ConfigService, SearchService],
    }).useMocker(token => {
      if (token === PlurkApiService) {
        mockPlurkApiService.getTimelinePlurks.mockResolvedValue(new PlurksDto());
        return mockPlurkApiService;
      }
    }).compile();

    searchService = app.get(SearchService);
  });

  describe('search', () => {
    it('should response SearchResultDto', async() => {
      expect(await searchService.search('query', FilterType.NONE, defaultOffset)).toBeInstanceOf(SearchResponseDto);
    });

    it('should request data with the given contraints', async() => {
      // given
      const filter = FilterType.FAVORITE;
      const offset = new Date('2023-03-04T00:00:00.000Z').toISOString();
      // when
      await searchService.search('query', filter, offset);
      // then
      expect(mockPlurkApiService.getTimelinePlurks).toBeCalledWith(filter, offset);
    });

    it('should add timestamp info in responses', async() => {
      const query = 'SEARCH QUERY';
      const latestPlurk = new PlurkDto({ postTime: new Date('2023-03-04T00:00:00.000Z') });
      const oldestPlurk = new PlurkDto({ postTime: new Date('2023-03-01T00:00:00.000Z') });

      // given
      mockPlurkApiService.getTimelinePlurks.mockResolvedValue(new PlurksDto({
        plurks: [latestPlurk, oldestPlurk],
      }));
      // when
      let response = await searchService.search(query, FilterType.NONE, defaultOffset);
      // then
      expect(response.firstTimestamp).toStrictEqual(new Date('2023-03-04T00:00:00.000Z'));
      expect(response.firstTimestampStr).toBe('2023-03-04T00:00:00.000Z');
      expect(response.lastTimestamp).toStrictEqual(new Date('2023-03-01T00:00:00.000Z'));
      expect(response.lastTimestampStr).toBe('2023-03-01T00:00:00.000Z');

      // given
      mockPlurkApiService.getTimelinePlurks.mockResolvedValue(new PlurksDto({
        plurks: [],
      }));
      // when
      response = await searchService.search(query, FilterType.NONE, defaultOffset);
      // then
      expect(response.firstTimestamp).toBeUndefined();
      expect(response.firstTimestampStr).toBeUndefined();
      expect(response.lastTimestamp).toBeUndefined();
      expect(response.lastTimestampStr).toBeUndefined();
    });

    it('should filter results by queries', async() => {
      // given
      const query = 'SEARCH QUERY';
      const plurkList = new PlurksDto({
        plurks: [
          { content: `A plurk that contains query ${query}.` },
          { content: 'A plurk that does not contains query.' },
          { content: `${query} A plurk that contains query.` },
        ],
      });
      mockPlurkApiService.getTimelinePlurks.mockResolvedValue(plurkList);
      // when
      const response = await searchService.search(query, FilterType.NONE, defaultOffset);
      // then
      expect(response.plurks.length).toBe(2);
      expect(response.counts).toBe(2);
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
      expect(response.plurks.length).toBe(2);
      expect(response.plurks.includes(plurk)).toBeTruthy();
    });
  });
});
