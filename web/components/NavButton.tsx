import type { ButtonProps } from '@mui/material';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

export default function NavButton({
  children,
  ...props
}: ButtonProps) {
  return <Button {...props} LinkComponent={NextLink}>{ children }</Button>;
};
