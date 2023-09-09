import type { FilterType } from '@/dto/FilterType.enum';
import type { SearchResponseDto } from '@/dto/SearchResponse.dto';
import Gateway from '@/lib/Gateway';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlurkCard from './PlurkCard';
import SearchMoreButton from './SearchMoreButton';

export default async function SearchResults({
  query,
  filter,
  offset,
}: {
  query: string
  filter?: FilterType
  offset?: Date
}) {
  const data: SearchResponseDto = await Gateway.getSearch(query, filter, offset);

  return (
    <Box>
      <Typography variant='h5' mb={4}>
        搜尋結果
      </Typography>

      <Box>
        {
          data.plurks.map(plurk => <PlurkCard key={plurk.id} plurk={plurk} />)
        }
      </Box>

      <SearchMoreButton
        variant='contained'
        fullWidth
        color='primary'
        size='large'
        sx={{ my: 2 }}
        startIcon={<SearchIcon />}
      >
        搜尋更久遠以前
      </SearchMoreButton>
    </Box>
  );
};
