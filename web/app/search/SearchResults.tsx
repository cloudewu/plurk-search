import LoadingButton from '@/components/LoadingButton';
import type SearchRequestParams from '@/dto/SearchRequestParams.dto';
import type SearchResponseDto from '@/dto/SearchResponse.dto';
import Gateway from '@/lib/Gateway';
import searchRequestParams2str from '@/lib/searchRequestParams2str';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import PlurkCard from './PlurkCard';

export default async function SearchResults({
  query,
  filter,
  offset,
}: SearchRequestParams) {
  const data: SearchResponseDto = await Gateway.getSearch(query, filter, offset);
  const queryStr = searchRequestParams2str({
    query,
    filter,
    offset: new Date(data.lastTimestampStr as string),
  });

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

      <LoadingButton
        loadingType='click'
        href={'/search?' + queryStr}
        variant='contained'
        fullWidth
        color='primary'
        size='large'
        sx={{ my: 2 }}
        startIcon={<SearchIcon />}
        LinkComponent={NextLink}
      >
        搜尋更久遠以前
      </LoadingButton>
    </Box>
  );
};
