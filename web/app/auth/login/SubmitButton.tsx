'use client';

import { Box } from '@mui/material';
import Button, { type ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export default function SubmitButton({
  children,
  ...props
}: ButtonProps) {
  const { pending } = useFormStatus();
  const iconSize = 24;
  const iconOffset = `${-iconSize / 2}px`;

  return (
    <Box display='inline-block' position='relative'>
      <Button
        {...props}
        disabled={pending}
      >
        驗證
      </Button>
      { pending &&
        <CircularProgress
          size={iconSize}
          sx={{
            position: 'absolute',
            top: '50%',
            marginTop: iconOffset,
            left: '50%',
            marginLeft: iconOffset,
          }}
        />
      }
    </Box>
  );
}
