'use client';

import Button, { type ButtonProps } from '@mui/material/Button';
import type { MouseEventHandler } from 'react';

export default function ClientButton({
  children,
  ...props
}: ButtonProps) {
  const handleSubmit: MouseEventHandler = (e) => {
    console.log('search more');
  };

  return (
    <Button {...props} onClick={handleSubmit}>
      { children }
    </Button>
  );
};
