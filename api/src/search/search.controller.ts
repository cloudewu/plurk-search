import { Controller, DefaultValuePipe, Get, Logger, Query } from '@nestjs/common';
import type { SearchResultsDto } from '@plurk-search/common/dto/SearchResults';
import { FilterType } from '@plurk-search/common/enum/FilterType';
import { AuthToken } from '~api/common/authToken.decorator';
import maskSecrets from '~api/common/maskSecretsHelper';
import { ParseEnumPipe } from '~api/pipe/parse-enum.pipe';
import { SearchService } from './search.service'; // eslint-disable-line @typescript-eslint/consistent-type-imports -- Nestjs dependency injection

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
  ): Promise<SearchResultsDto> {
    this.logRequest('/search', { token, query, filter: FilterType[filter], offset });
    return await this.searchService.search(token, query, filter, offset);
  }

  private logRequest(endpoint: string, params: any) {
    const guardedParams = maskSecrets(params);
    this.logger.log(`Received Request: ${endpoint}; params: ${JSON.stringify(guardedParams)}`);
  }
}
