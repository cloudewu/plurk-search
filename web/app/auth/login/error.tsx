'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState, type MouseEventHandler } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleClick: MouseEventHandler = (_e) => {
    setClicked(true);
    reset();
    window.location.reload();
  };

  return (
    <Box>
      <Typography>請求授權的過程中好像出了點問題……</Typography>
      <Typography>請檢察驗證碼是否正確，或嘗試重整頁面，若問題持續存在，請聯繫開發人員。</Typography>

      <Button variant='contained' onClick={handleClick} disabled={clicked} sx={{ my: 2 }}>
        重整頁面
      </Button>

      <Typography
        variant='body2'
        my={2}
        p={2}
        color='gray'
        border={2}
        borderColor='lightgray'
        borderRadius={2}
        fontFamily='Courier New'
      >
        { error?.digest !== null && <>[{error.digest}]</>}
        { error.message }
      </Typography>
    </Box>
  );
};
