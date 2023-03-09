import { createMock, type DeepMocked } from '@golevelup/ts-jest';
import { Test, type TestingModule } from '@nestjs/testing';
import { FilterType } from '../dto/filter-type.enum';
import { SearchResponseDto } from '../dto/searchResponse.dto';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let app: TestingModule;

  beforeAll(async() => {
    app = await Test.createTestingModule({
      controllers: [SearchController],
    }).useMocker(createMock)
      .compile();

    const service: DeepMocked<SearchService> = app.get(SearchService);
    service.search.mockResolvedValue(new SearchResponseDto());
  });

  describe('getSearch', () => {
    it('should accept available parameters', async() => {
      // given
      const token = 'This is a token';
      const query = 'Search query';
      const filter = FilterType.MY;
      const offset = new Date('2023-03-04T00:00:00.000Z').toISOString();
      // when
      const controller = app.get(SearchController);
      await controller.getSearch(token, query, filter, offset);
      // then
      const service = app.get(SearchService);
      expect(service.search).toHaveBeenCalledWith(token, query, filter, offset);
    });
  });
});
