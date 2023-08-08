import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SearchMoreButton from './SearchMoreButton';
import mockPlurks from './mockPlurks';

export default function SearchResults() {
  return (
    <Box>
      <Typography variant='h5' mb={4}>
        搜尋結果
      </Typography>

      <Box>
        {
          mockPlurks.plurks.map((plurk) => (
            <Card elevation={2} sx={{ my: 2, maxHeight: '450px', overflowY: 'auto' }}>
              <CardContent sx={{ position: 'relative', my: 1 }}>
                <IconButton
                  size='large'
                  sx={{ position: 'absolute', top: 8, right: 20 }}
                  href={plurk.link}
                  target='_blank'
                >
                  <OpenInNewIcon />
                </IconButton>

                <Typography
                  variant='h6'
                  fontWeight='bold'
                  mb={3}
                  sx={{ color: 'primary.dark' }}
                >
                  <AccountCircleIcon sx={{ mx: 0.5, verticalAlign: 'text-bottom' }} />
                  { plurk.owner?.displayName ?? 'plurker' }
                  <Typography
                    component='span'
                    fontSize='0.8rem'
                    mx={1}
                    sx={{ opacity: 0.5, verticalAlign: 'text-bottom' }}
                  >
                    @{ plurk.owner?.nickName ?? 'user-id' }
                  </Typography>
                </Typography>
                <Typography
                  component='div'
                  sx={{ px: 1 }}
                  dangerouslySetInnerHTML={{
                    __html: plurk.contentHtml ?? 'none',
                  }}
                />
              </CardContent>
            </Card>
          ))
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
