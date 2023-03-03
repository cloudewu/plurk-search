import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PlurkApiService } from '../broker/plurk-api.service';
import { type FilterType } from './dto/filter-type.enum';

@Injectable()
export class SearchService {
  constructor(@Inject(forwardRef(() => PlurkApiService)) private readonly plurkApiService: PlurkApiService) {}

  async search(query: string, filter: FilterType) {
    const plurks = await this.plurkApiService.getTimelinePlurks(filter);
    return plurks;
  }
}
