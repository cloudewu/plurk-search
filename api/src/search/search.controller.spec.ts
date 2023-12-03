import { createMock, type DeepMocked } from '@golevelup/ts-jest';
import { Test, type TestingModule } from '@nestjs/testing';
import { SearchResultsDto } from '@plurk-search/common/dto/SearchResults';
import { FilterType } from '@plurk-search/common/enum/FilterType';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let controller: SearchController;
  let service: DeepMocked<SearchService>;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
    }).useMocker(createMock)
      .compile();

    controller = module.get(SearchController);
    service = module.get(SearchService);

    service.search.mockResolvedValue(new SearchResultsDto());
  });

  describe('getSearch', () => {
    it('should return SearchResponse', async() => {
      // given
      const token = 'This is a token';
      const query = 'Search query';
      const filter = FilterType.MY;
      const offset = new Date('2023-03-04T00:00:00.000Z').toISOString();

      // when
      const ret = await controller.getSearch(token, query, filter, offset);

      // then
      expect(ret).toBeInstanceOf(SearchResultsDto);
    });

    it('should accept available parameters', async() => {
      // given
      const token = 'This is a token';
      const query = 'Search query';
      const filter = FilterType.MY;
      const offset = new Date('2023-03-04T00:00:00.000Z').toISOString();

      // when
      await controller.getSearch(token, query, filter, offset);

      // then
      expect(service.search).toHaveBeenCalledWith(token, query, filter, offset);
    });
  });
});
