import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

export default function SearchPage() {
  return (
    <main>
      <Box py={6}>
        <Typography variant='h4' mx={2}>
          搜尋時間軸
        </Typography>
        <SearchForm />

        <Divider sx={{ my: 4 }} />

        <SearchResults />
      </Box>
    </main>
  );
};
