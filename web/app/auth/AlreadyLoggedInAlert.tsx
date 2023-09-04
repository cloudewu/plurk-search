import NavButton from '@/components/NavButton';
import Alert from '@mui/material/Alert';

export default function AlreadyLoggedInAlert() {
  return (
    <Alert
      severity='info'
      color='info'
      action={
        <NavButton
          href='/search'
          variant='outlined'
          color='primary'
          sx={{ mx: 0.5 }}
        >
          開始搜尋
        </NavButton>
      }>
      你已經申請過驗證碼囉，是否前往搜尋？
    </Alert>
  );
};
