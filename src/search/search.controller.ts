import { Controller, DefaultValuePipe, Get, Logger, Query } from '@nestjs/common';
import { ParseEnumPipe } from '../pipes/parse-enum.pipe';
import { FilterType } from './dto/filter-type.enum';
import type { SearchResponseDto } from './dto/searchResponse.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Get()
  async getSearch(
    @Query('query') query: string,
      @Query('filter', new ParseEnumPipe(FilterType), new DefaultValuePipe(FilterType.NONE)) filter: FilterType,
  ): Promise<SearchResponseDto> {
    this.logRequest('/search', { query, filter: FilterType[filter] });
    return await this.searchService.search(query, filter);
  }

  private logRequest(endpoint: string, params: any) {
    this.logger.log(`Received Request: ${endpoint}; params: ${JSON.stringify(params)}`);
  }
}
