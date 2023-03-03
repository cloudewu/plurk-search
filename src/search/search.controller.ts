import { Controller, Get, Logger, ParseEnumPipe, Query } from '@nestjs/common';
import { FilterType } from './dto/filter-type.enum';
import { SearchResponseDto } from './dto/search-response.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Get()
  getSearch(
    @Query('query') query: string,
      @Query('filter', new ParseEnumPipe(FilterType)) filter: FilterType = FilterType.NONE): SearchResponseDto {
    this.logger.log(`Get query ${query}; filter ${filter}.`);
    return this.searchService.search(query, filter);
  }
}
