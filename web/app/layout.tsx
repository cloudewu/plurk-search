import ResetTokenButton from '@/components/ResetTokenButton';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import NextLink from 'next/link';
import { COOKIE_TOKEN } from '../consts/const';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plurk Search',
  description: 'A specialized search engine for personal plurk contents.',
  viewport: 'initial-scale=1, width=device-width',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loggedIn = !((cookies()?.get(COOKIE_TOKEN)) == null);

  return (
    <html lang='zh-tw'>
      <body>
        <AppBar position='static'>
          <Toolbar disableGutters sx={{ px: 2 }}>
            <IconButton href='/' LinkComponent={NextLink} sx={{ color: 'white' }}>
              <HomeIcon />
            </IconButton>
            <Typography variant='h6' sx={{ flexGrow: 1 }}>
              Plurk Search
            </Typography>
            {
              loggedIn && (
                <ResetTokenButton
                  size='large'
                  color='inherit'
                  startIcon={ <LogoutIcon /> }
                >
                  登出
                </ResetTokenButton>
              )
            }
          </Toolbar>
        </AppBar>

        <Container component='main' sx={{ py: 3 }}>
          {children}
        </Container>
      </body>
    </html>
  );
}
