import Typography from '@mui/material/Typography';

export default function SectionTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Typography variant='h5' component='h3' my={2}>{ children }</Typography>
  );
};
