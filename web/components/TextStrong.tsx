import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

const DEFAULT_FONTWEIGHT = 600;

export default function TextBold({
  children,
  weight,
}: {
  children: ReactNode
  weight?: string | number
}) {
  return <Box component='span' fontWeight={weight ?? DEFAULT_FONTWEIGHT}>{ children }</Box>;
};
