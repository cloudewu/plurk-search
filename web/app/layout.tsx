import HomeIcon from '@mui/icons-material/Home';
import { AppBar, Container, IconButton, Toolbar, Typography } from '@mui/material';
import type { Metadata } from 'next';
import Head from 'next/head';
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
  return (
    <html lang="zh-tw">
      <Head>
      </Head>
      <body>
        <AppBar position='static'>
          <Toolbar className='px-3'>
            <IconButton className='text-white' href='/'>
              <HomeIcon></HomeIcon>
            </IconButton>
            <Typography variant='h6'>
              Plurk Search
            </Typography>
          </Toolbar>
        </AppBar>
        <Container>
          {children}
        </Container>
      </body>
    </html>
  );
}
