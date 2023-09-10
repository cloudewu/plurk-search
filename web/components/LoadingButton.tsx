'use client';

import Box from '@mui/material/Box';
import Button, { type ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, type MouseEventHandler } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

const CLICK_REFRESH_TIME = 2000;

export default function({
  loadingType,
  ...props
}: ButtonProps & { loadingType: 'form' | 'click', iconSize?: number, float?: string }) {
  if (loadingType === 'form') return <FormLoadingButton {...props} />;
  if (loadingType === 'click') return <ClickLoadingButton {...props} />;
  return <LoadingButton loading={false} {...props} />;
};

function FormLoadingButton(props: ButtonProps & { iconSize?: number }) {
  const { pending } = useFormStatus();
  return <LoadingButton loading={pending} {...props} />;
};

function ClickLoadingButton(props: ButtonProps & { iconSize?: number }) {
  const [clicked, setClicked] = useState<boolean>(false);

  const clickHandler: MouseEventHandler = (_e) => {
    setClicked(true);
    setTimeout(() => { setClicked(false); }, CLICK_REFRESH_TIME);
  };

  return <LoadingButton loading={clicked} onClick={clickHandler} {...props} />;
};

function LoadingButton({
  loading,
  iconSize,
  float,
  fullWidth,
  children,
  ...props
}: ButtonProps & { loading: boolean, iconSize?: number, float?: string }) {
  iconSize = iconSize ?? 24;
  const iconOffset = `${-iconSize / 2}px`;

  return (
    <Box
      display={(fullWidth ?? false) ? 'inherit' : 'inline-block'}
      position='relative'
      sx={{ float: float ?? 'inherit' }}
    >
      <Button
        fullWidth
        {...props}
        disabled={loading}
      >
        { children }
      </Button>
      { loading &&
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
};
