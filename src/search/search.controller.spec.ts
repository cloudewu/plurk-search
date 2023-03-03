import { Test, type TestingModule } from '@nestjs/testing';
import { SearchResponseDto } from './dto/search-response.dto';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let app: TestingModule;

  beforeAll(async() => {
    app = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [SearchService],
    }).compile();
  });

  describe('getSearch', () => {
    it('should search for the given query', () => {
      const appController = app.get(SearchController);
      const query = 'Search query';
      const response = new SearchResponseDto(query);

      expect(appController.getSearch(query)).toStrictEqual(response);
    });
  });
});
