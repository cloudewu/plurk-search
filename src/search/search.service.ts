import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import type { PlurkDto } from '../broker/dto/plurk.dto';
import type { PlurksDto } from '../broker/dto/plurks.dto';
import { PlurkApiService } from '../broker/plurk-api.service';
import { type FilterType } from './dto/filter-type.enum';
import { SearchResponseDto } from './dto/searchResponse.dto';

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
    this.logger.log(`Got ${plurkList.plurks.length}. Start filtering results`);
    for (const plurk of plurkList.plurks) {
      if (plurk.content?.includes(query) === true) {
        SearchService.addPlurkToResponse(response, plurk);
      }
    }
    this.logger.log(`Filter finished. #Results = ${response.counts}`);
    return response;
  }

  static addPlurkToResponse(response: SearchResponseDto, plurk: PlurkDto) {
    response.plurks.push(plurk);
    response.counts += 1;
  }
}
