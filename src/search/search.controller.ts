import { Controller, Get, Logger, ParseEnumPipe, Query } from '@nestjs/common';
import { FilterType } from './dto/filter-type.enum';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Get()
  async getSearch(
  @Query('query') query: string,
    @Query('filter', new ParseEnumPipe(FilterType)) filter: FilterType = FilterType.NONE) {
    this.logger.log(`Get query ${query}; filter ${filter}.`);
    return await this.searchService.search(query, filter);
  }
}
