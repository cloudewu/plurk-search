import { Test, type TestingModule } from '@nestjs/testing';
import { FilterType } from '../dto/filter-type.enum';
import { PlurksDto } from '../dto/plurks.dto';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  const fakeToken = 'Fake token';

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
      const offset = new Date('2023-03-04T00:00:00.000Z').toISOString();
      // when
      const controller = app.get(SearchController);
      await controller.getSearch(fakeToken, query, filter, offset);
      // then
      const service = app.get(SearchService);
      expect(service.search).toHaveBeenCalledWith(fakeToken, query, filter, offset);
    });
  });
});
