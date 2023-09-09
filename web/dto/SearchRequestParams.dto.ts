import FilterType from './FilterType.enum';
import BaseDto from './base.dto';

export class SearchRequestParams extends BaseDto {
  query?: string
  filter?: FilterType
  offset?: Date
};
export default SearchRequestParams;
