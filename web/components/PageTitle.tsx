import Typography from '@mui/material/Typography';

export default function PageTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Typography variant='h4' component='h2' mt={2} mb={5}>{ children }</Typography>
  );
};
