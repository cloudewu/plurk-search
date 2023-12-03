import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import PageTitle from '~web/components/PageTitle';

export default function Layout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Box>
      <PageTitle>
        搜尋時間軸
      </PageTitle>
      { children }
    </Box>
  );
};
