import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function Loading() {
  return (
    <Box display='flex' gap={2} justifyContent='start' alignItems='center'>
      <CircularProgress />
      <Typography variant='button'>
        加載中……
      </Typography>
    </Box>
  );
};
