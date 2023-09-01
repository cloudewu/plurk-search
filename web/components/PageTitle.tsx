import { Typography } from '@mui/material';

export default function PageTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Typography variant='h4' mt={2} mb={4}>{ children }</Typography>
  );
};
