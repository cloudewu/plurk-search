import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { isNullish } from '../common/util';
import type { AuthDetail } from '../dto/authDetail.dto';
import { FilterType } from '../dto/filter-type.enum';
import type { PlurkDto } from '../dto/plurk.dto';
import type { PlurksDto } from '../dto/plurks.dto';
import { SearchResponseDto } from '../dto/searchResponse.dto';
import { PlurkApiService } from '../gateway/plurk-api.service';

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
    offset: string | undefined): Promise<SearchResponseDto> {
    const credentials: AuthDetail = this.authService.decryptAndVerify(token);
    const plurks = await this.plurkApiService.getTimelinePlurks(credentials, filter, offset);
    return this.filterPlurk(plurks, query, filter);
  }

  private filterPlurk(plurkList: PlurksDto, query: string, filter: FilterType): SearchResponseDto {
    const response = new SearchResponseDto({
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

  private addTimestampToResponse(response: SearchResponseDto, plurkList: PlurksDto): void {
    if (plurkList.plurks.length <= 0) {
      return;
    }

    response.firstTimestamp = plurkList.plurks[0].postTime;
    response.firstTimestampStr = plurkList.plurks[0].postTime?.toISOString();
    const lastIdx = plurkList.plurks.length - 1;
    response.lastTimestamp = plurkList.plurks[lastIdx].postTime;
    response.lastTimestampStr = plurkList.plurks[lastIdx].postTime?.toISOString();
  }

  private addNextLinkToResponse(response: SearchResponseDto): void {
    if (isNullish(response.lastTimestampStr)) {
      return;
    }

    const request = response.request;
    const params: Record<string, string | null> = {
      query: request.query,
      filter: FilterType[request.filter],
    };
    params.offset = response.lastTimestampStr ?? null;

    // todo: refactor
    let nextLink = `${this.configService.get<string>('HOST') ?? ''}/search`;
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

  static addPlurkToResponse(response: SearchResponseDto, plurk: PlurkDto) {
    response.plurks.push(plurk);
    response.counts += 1;
  }
}
