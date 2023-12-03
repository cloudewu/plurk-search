import type FilterType from '@plurk-search/common/enum/FilterType';

interface SearchRequestParams {
  query?: string
  filter?: FilterType
  offset?: Date
}
export default SearchRequestParams;
