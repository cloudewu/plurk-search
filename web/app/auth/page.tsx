import { COOKIE_TOKEN } from '@/consts/const';
import Box from '@mui/material/Box';
import { cookies } from 'next/headers';
import ReLoginPanel from './ReLoginPanel';
import RequestPanel from './RequestPanel';

export default function AuthPage() {
  const token = cookies().get(COOKIE_TOKEN);

  return (
    <main>
      <Box p={4}>
        { token !== undefined ? <ReLoginPanel /> : <RequestPanel /> }
      </Box>
    </main>
  );
};
