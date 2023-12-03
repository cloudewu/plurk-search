import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { PlurkDto } from '@plurk-search/common/dto/Plurk';
import type { PlurksDto } from '@plurk-search/common/dto/Plurks';
import { SearchResultsDto } from '@plurk-search/common/dto/SearchResults';
import { FilterType } from '@plurk-search/common/enum/FilterType';
import type { AuthService } from '~api/auth/auth.service';
import { isNullish } from '~api/common/util';
import type { AuthObject } from '~api/dataobject/AuthObject';
import { PlurkApiService } from '~api/gateway/plurk-api.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => PlurkApiService)) private readonly plurkApiService: PlurkApiService,
  ) {}

  async search(
    token: string,
    query: string,
    filter: FilterType,
    offset: string | undefined): Promise<SearchResultsDto> {
    const credentials: AuthObject = this.authService.decryptAndVerify(token);
    const plurks = await this.plurkApiService.getTimelinePlurks(credentials, filter, offset);
    return this.filterPlurk(plurks, query, filter);
  }

  private filterPlurk(plurkList: PlurksDto, query: string, filter: FilterType): SearchResultsDto {
    const response = new SearchResultsDto({
      request: { query, filter },
    });
    this.addTimestampToResponse(response, plurkList);

    this.logger.log(`Got ${plurkList.plurks.length}. Start filtering results`);
    for (const plurk of plurkList.plurks) {
      if (plurk.content?.includes(query) === true) {
        SearchService.addPlurkToResponse(response, plurk);
      }
    }
    this.logger.log(`Filter finished. #Results = ${response.counts}`);

    this.addNextLinkToResponse(response);
    return response;
  }

  private addTimestampToResponse(response: SearchResultsDto, plurkList: PlurksDto): void {
    if (plurkList.plurks.length <= 0) {
      return;
    }

    response.firstTimestamp = plurkList.plurks[0].postTime;
    response.firstTimestampStr = plurkList.plurks[0].postTime?.toISOString();
    const lastIdx = plurkList.plurks.length - 1;
    response.lastTimestamp = plurkList.plurks[lastIdx].postTime;
    response.lastTimestampStr = plurkList.plurks[lastIdx].postTime?.toISOString();
  }

  private addNextLinkToResponse(response: SearchResultsDto): void {
    if (isNullish(response.lastTimestampStr)) {
      return;
    }

    /* TODO: improve the typing */
    const request = response.request;
    if (request == null) return;

    const params: Record<string, string | null> = {
      query: request.query as string,
      filter: FilterType[request.filter as FilterType],
      offset: response.lastTimestampStr ?? null,
    };

    // todo: refactor
    let nextLink = `${this.configService.get<string>('baseUrl') ?? ''}/search`;
    let first = true;
    for (const key in params) {
      const value = params[key];
      if (value === null) continue;

      nextLink += first ? '?' : '&';
      nextLink += `${key}=${value}`;
      first = false;
    }
    response.next = nextLink;
  }

  static addPlurkToResponse(response: SearchResultsDto, plurk: PlurkDto) {
    response.plurks.push(plurk);
    response.counts += 1;
  }
}
