import PageTitle from '@/components/PageTitle';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

export default function SearchPage() {
  return (
    <Box>
      <PageTitle>
        搜尋時間軸
      </PageTitle>
      <SearchForm />

      <Divider sx={{ my: 4 }} />

      <SearchResults />
    </Box>
  );
};
