import { Test, type TestingModule } from '@nestjs/testing';
import { PlurksDto } from '../broker/dto/plurks.dto';
import { PlurkApiService } from '../broker/plurk-api.service';
import { FilterType } from './dto/filter-type.enum';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

describe('SearchService', () => {
  let app: TestingModule;
  let searchService: SearchService;

  beforeAll(async() => {
    app = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [SearchService],
    }).useMocker(token => {
      if (token === PlurkApiService) {
        const response = new PlurksDto();
        return { getTimelinePlurks: jest.fn().mockResolvedValue(response) };
      }
    }).compile();

    searchService = app.get(SearchService);
  });

  describe('search', () => {
    it('should search for a given query', async() => {
      const query = 'Search query';
      const filter = FilterType.FAVORITE;

      expect(await searchService.search(query, filter)).toBeInstanceOf(PlurksDto);
    });
  });
});
