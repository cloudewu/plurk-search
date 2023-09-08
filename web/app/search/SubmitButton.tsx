'use client';

import Box from '@mui/material/Box';
import Button, { type ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export default function SubmitButton({
  children,
  float,
  ...props
}: ButtonProps & { float?: string }) {
  const { pending } = useFormStatus();
  const iconSize = 24;
  const iconOffset = `${-iconSize / 2}px`;

  return (
    <Box display='inline-block' position='relative' sx={{ float: float ?? 'inherit' }}>
      <Button
        {...props}
        disabled={pending}
      >
        { children }
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
