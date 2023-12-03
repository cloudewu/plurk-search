import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FilterType from '@plurk-search/common/enum/FilterType';
import { Suspense } from 'react';
import type SearchRequestParams from '~web/types/SearchRequestParams';

import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import SearchResultsFallback from './SearchResultsFallback';

interface QueryParams {
  query?: string
  filter?: string
  offset?: string
};

function parseParameter(params: QueryParams): SearchRequestParams {
  const query: string = params.query ?? '';
  const filter: FilterType | undefined =
    (params.filter ?? '') in FilterType
      ? FilterType[params.filter as keyof typeof FilterType]
      : undefined;
  const convertedOffset = Date.parse(params.offset ?? '');
  const offset: Date | undefined = !isNaN(convertedOffset) ? new Date(convertedOffset) : undefined;
  return { query, filter, offset };
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: QueryParams
}) {
  const { query, filter, offset } = parseParameter(searchParams);

  return (
    <Box>
      <SearchForm query={query} filter={filter} offset={offset} />

      <Divider sx={{ my: 4 }} />

      <Suspense fallback={<SearchResultsFallback />}>
        <SearchResults query={query} filter={filter} offset={offset} />
      </Suspense>
    </Box>
  );
};
