'use client';

import removeTokenFromCookies from '@/actions/removeTokenFromCookies';
import Button, { type ButtonProps } from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useState, type MouseEventHandler } from 'react';

const COOKIE_TIMEOUT = 500;

export default function ResetTokenButton({
  children,
  ...props
}: ButtonProps) {
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleReset: MouseEventHandler = (e) => {
    setProcessing(true);
    void removeTokenFromCookies();
    setTimeout(() => {
      setProcessing(false);
      router.refresh();
    }, COOKIE_TIMEOUT);
  };

  return (
    <Button {...props} onClick={handleReset} disabled={processing}>
      { children }
    </Button>
  );
};
