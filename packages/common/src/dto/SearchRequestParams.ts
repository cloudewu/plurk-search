import type FilterType from '@plurk-search/common/enum/FilterType';
import BaseDto from './Base';

export class SearchRequestParams extends BaseDto {
  query?: string;
  filter?: FilterType;
  offset?: Date;
};
export default SearchRequestParams;
