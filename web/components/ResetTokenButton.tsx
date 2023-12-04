'use client';

import Button, { type ButtonProps } from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useState, type MouseEventHandler } from 'react';
import updateCookies from '~web/actions/updateCookies';
import { COOKIE_TOKEN } from '~web/constants';

const REFRESH_TIMEOUT = 500;

export default function ResetTokenButton({
  children,
  ...props
}: ButtonProps) {
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleReset: MouseEventHandler = (e) => {
    setProcessing(true);
    void updateCookies({}, [COOKIE_TOKEN]);
    setTimeout(() => {
      setProcessing(false);
      router.refresh();
    }, REFRESH_TIMEOUT);
  };

  return (
    <Button {...props} onClick={handleReset} disabled={processing}>
      { children }
    </Button>
  );
};
