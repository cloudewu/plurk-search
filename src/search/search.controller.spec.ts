import { Test, type TestingModule } from '@nestjs/testing';
import { PlurksDto } from '../broker/dto/plurks.dto';
import { FilterType } from './dto/filter-type.enum';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let app: TestingModule;

  beforeAll(async() => {
    app = await Test.createTestingModule({
      controllers: [SearchController],
    }).useMocker(token => {
      if (token === SearchService) {
        const response = new PlurksDto();
        return { search: jest.fn().mockResolvedValue(response) };
      }
    }).compile();
  });

  describe('getSearch', () => {
    it('should accept available parameters', async() => {
      // given
      const query = 'Search query';
      const filter = FilterType.MY;
      // when
      const controller = app.get(SearchController);
      await controller.getSearch(query, filter);
      // then
      const service = app.get(SearchService);
      expect(service.search).toHaveBeenCalledWith(query, filter);
    });
  });
});
