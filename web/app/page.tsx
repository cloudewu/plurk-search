import { Button, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <main>
      <div>
        <Typography variant='h4' sx={{ my: 4 }}>
          start searching:
          <Button href='/search' variant='contained' size='large' color='secondary' sx={{ mx: 2 }}>
            Go!
          </Button>
        </Typography>
      </div>
    </main>
  );
}
