import { Injectable } from '@nestjs/common';
import { type FilterType } from './dto/filter-type.enum';
import { SearchResponseDto } from './dto/search-response.dto';

@Injectable()
export class SearchService {
  search(query: string, filter: FilterType): SearchResponseDto {
    const response = new SearchResponseDto(query);
    return response;
  }
}
