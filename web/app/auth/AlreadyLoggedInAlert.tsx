import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

export default function AlreadyLoggedInAlert() {
  return (
    <Alert
      severity='info'
      color='info'
      action={
        <NextLink href='/search' passHref>
          <Button variant='outlined' color='primary' sx={{ mx: 0.5 }}>
            開始搜尋
          </Button>
        </NextLink>
      }>
      你已經申請過驗證碼囉，是否前往搜尋？
    </Alert>
  );
};
