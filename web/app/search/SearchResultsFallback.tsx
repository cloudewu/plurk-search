import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

function SkeletonCard() {
  return (
    <Card elevation={2} sx={{ my: 2 }}>
      <CardHeader
        avatar={<Skeleton variant='circular' height={24} width={24} />}
        title={<Typography variant='h6' width='30%' minWidth='150px'><Skeleton /></Typography>}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant='body1'><Skeleton /></Typography>
        <Typography variant='body1'><Skeleton /></Typography>
        <Typography variant='body1'><Skeleton /></Typography>
        <Typography variant='body1' width='250px'><Skeleton /></Typography>
      </CardContent>
    </Card>
  );
}

export default function SearchResultsFallback() {
  const skeletonCnt = 3;
  return (
    <Box>
      <Typography variant='h5' mb={4}>
        搜尋結果
      </Typography>

      <Box>
        { Array(skeletonCnt).fill(null).map(() => <SkeletonCard />) }
      </Box>
    </Box>
  );
};
