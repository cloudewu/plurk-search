import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import ResetButton from './ResetButton';

export default function RequestPanel() {
  return (
    <Box>
      <Typography my={2}>
        你已經申請過驗證碼囉，是否要重新驗證？
      </Typography>

      <NextLink href='/search' passHref>
        <Button variant='outlined' color='success' sx={{ mr: 2 }}>
          不登出，前往搜尋河道！
        </Button>
      </NextLink>

      <ResetButton variant='outlined' color='error'>
        清除現有登入資料並重新驗證
      </ResetButton>
    </Box>
  );
};
