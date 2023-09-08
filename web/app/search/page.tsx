import PageTitle from '@/components/PageTitle';
import { FilterType } from '@/dto/FilterType.enum';
import Gateway from '@/lib/Gateway';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

export interface SearchParameters {
  query?: string
  filter?: string
  offset?: string
};

function parseParameter(params: SearchParameters) {
  const query: string = params.query ?? '';
  const filter: FilterType | undefined =
    (params.filter ?? '') in FilterType
      ? FilterType[params.filter as keyof typeof FilterType]
      : undefined;
  const convertedOffset = Date.parse(params.offset ?? '');
  const offset: Date | undefined = !isNaN(convertedOffset) ? new Date(convertedOffset) : undefined;
  return { query, filter, offset };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParameters
}) {
  const { query, filter, offset } = parseParameter(searchParams);
  const data = await Gateway.getSearch(query, filter, offset);

  return (
    <Box>
      <PageTitle>
        搜尋時間軸
      </PageTitle>
      <SearchForm query={query} filter={filter} offset={offset} />

      <Divider sx={{ my: 4 }} />

      <SearchResults data={data} />
    </Box>
  );
};
