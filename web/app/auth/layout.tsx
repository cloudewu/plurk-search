import PageTitle from '@/components/PageTitle';
import { COOKIE_TOKEN } from '@/consts/const';
import Box from '@mui/material/Box';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';

import AlreadyLoggedInAlert from './AlreadyLoggedInAlert';

export default function Layout({
  children,
}: {
  children: ReactNode
}) {
  const token = cookies().get(COOKIE_TOKEN);

  return (
    <Box>
      { token !== undefined && <AlreadyLoggedInAlert /> }
      <PageTitle>
        應用程式授權
      </PageTitle>
      { children }
    </Box>
  );
};
