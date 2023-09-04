'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { redirect } from 'next/navigation';
import { useEffect, type MouseEventHandler } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleClick: MouseEventHandler = (e) => {
    redirect('/auth');
  };

  return (
    <Box>
      <Typography>出錯了</Typography>
      <Button variant='contained' onClick={handleClick}>重新請求</Button>
      <Typography
        component='pre'
        my={2}
        p={2}
        color='gray'
        border={2}
        borderColor='lightgray'
        borderRadius={2}
        fontFamily='Courier New'
      >
        { error.message }
      </Typography>
    </Box>
  );
};
