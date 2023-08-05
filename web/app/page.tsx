import { Button, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <main>
      <div className='my-3'>
        <Typography variant='h4'>
          start searching:
          <Button href='/search' variant='contained' size='large' color='secondary' className='mx-2'>
            Go!
          </Button>
        </Typography>
      </div>
    </main>
  );
}
