import { Controller, DefaultValuePipe, Get, Logger, Query } from '@nestjs/common';
import { AuthToken } from '../common/authToken.decorator';
import { FilterType } from '../dto/filter-type.enum';
import type { SearchResponseDto } from '../dto/searchResponse.dto';
import { ParseEnumPipe } from '../pipe/parse-enum.pipe';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Get()
  async getSearch(
    @AuthToken() token: string,
      @Query('query') query: string,
      @Query('filter', new ParseEnumPipe(FilterType), new DefaultValuePipe(FilterType.NONE)) filter: FilterType,
      @Query('offset') offset: string | undefined,
  ): Promise<SearchResponseDto> {
    this.logRequest('/search', { token, query, filter: FilterType[filter], offset });
    return await this.searchService.search(token, query, filter, offset);
  }

  private logRequest(endpoint: string, params: any) {
    this.logger.log(`Received Request: ${endpoint}; params: ${JSON.stringify(params)}`);
  }
}
