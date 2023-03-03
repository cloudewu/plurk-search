import type { PlurkApiService } from 'src/broker/plurk-api.service';
import { FilterType } from './dto/filter-type.enum';
import { SearchResponseDto } from './dto/search-response.dto';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let searchService: SearchService;
  let plurkApiService: PlurkApiService;

  beforeAll(async() => {
    searchService = new SearchService(plurkApiService);
  });

  describe('search', () => {
    it('should search for a given query', () => {
      const query = 'Search query';
      const response = new SearchResponseDto(query);

      expect(searchService.search(query, FilterType.LIKE)).toStrictEqual(response);
    });
  });
});
