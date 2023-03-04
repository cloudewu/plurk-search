import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { type FilterType } from '../dto/filter-type.enum';
import type { PlurkDto } from '../dto/plurk.dto';
import type { PlurksDto } from '../dto/plurks.dto';
import { SearchResponseDto } from '../dto/searchResponse.dto';
import { PlurkApiService } from '../gateway/plurk-api.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(@Inject(forwardRef(() => PlurkApiService)) private readonly plurkApiService: PlurkApiService) {}

  async search(query: string, filter: FilterType): Promise<SearchResponseDto> {
    const plurks = await this.plurkApiService.getTimelinePlurks(filter);
    return this.filterPlurk(plurks, query);
  }

  private filterPlurk(plurkList: PlurksDto, query: string): SearchResponseDto {
    const response = new SearchResponseDto();
    this.addTimestampToResponse(response, plurkList);

    this.logger.log(`Got ${plurkList.plurks.length}. Start filtering results`);
    for (const plurk of plurkList.plurks) {
      if (plurk.content?.includes(query) === true) {
        SearchService.addPlurkToResponse(response, plurk);
      }
    }
    this.logger.log(`Filter finished. #Results = ${response.counts}`);

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

  static addPlurkToResponse(response: SearchResponseDto, plurk: PlurkDto) {
    response.plurks.push(plurk);
    response.counts += 1;
  }
}
