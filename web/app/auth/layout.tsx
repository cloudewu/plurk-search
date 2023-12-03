import Box from '@mui/material/Box';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import PageTitle from '~web/components/PageTitle';
import { COOKIE_TOKEN } from '~web/constants';
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
