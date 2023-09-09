import FilterType from '@/dto/FilterType.enum';
import type SearchRequestParams from '../dto/SearchRequestParams.dto';

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
