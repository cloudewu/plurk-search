import { Test, type TestingModule } from '@nestjs/testing';
import { PlurksDto } from '../broker/dto/plurks.dto';
import { PlurkApiService } from '../broker/plurk-api.service';
import { FilterType } from './dto/filter-type.enum';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SearchResponseDto } from './dto/searchResponse.dto';
import { PlurkDto } from '../broker/dto/plurk.dto';

describe('SearchService', () => {
  let app: TestingModule;
  let searchService: SearchService;
  const mockPlurkApiService = {
    getTimelinePlurks: jest.fn(),
  };

  beforeAll(async() => {
    app = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [SearchService],
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
      expect(await searchService.search('query', FilterType.NONE)).toBeInstanceOf(SearchResponseDto);
    });

    it('should request data with the given contraints', async() => {
      // given
      const filter = FilterType.FAVORITE;
      // when
      await searchService.search('query', filter);
      // then
      expect(mockPlurkApiService.getTimelinePlurks).toBeCalledWith(filter);
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
      const response = await searchService.search(query, FilterType.NONE);
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
