import FilterType from '@plurk-search/common/enum/FilterType';
import type SearchRequestParams from '~web/types/SearchRequestParams';

export default function searchRequestParams2str({
  query,
  filter,
  offset,
  required,
}: SearchRequestParams & { required?: string[] }): string {
  const params: Record<string, string> = {};
  required = required ?? [];

  if ((query != null && query !== '') || required.includes('query')) {
    params.query = query ?? '';
  }
  if (filter != null || required.includes('filter')) {
    params.filter = FilterType[filter ?? FilterType.NONE];
  }
  if (offset != null || required.includes('offset')) {
    params.offset = (offset ?? new Date())?.toISOString();
  }

  return new URLSearchParams(params).toString();
};
