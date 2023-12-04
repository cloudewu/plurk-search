import Alert from '@mui/material/Alert';
import NavButton from '~web/components/NavButton';

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
          sx={{ my: 'auto', minWidth: 'max-content' }}
        >
          開始搜尋
        </NavButton>
      }
    >
      你已經申請過驗證碼囉！重新驗證將使原先的授權失效。
    </Alert>
  );
};
