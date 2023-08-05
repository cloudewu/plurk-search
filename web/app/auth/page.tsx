import ConstructionIcon from '@mui/icons-material/Construction';
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <main>
      <div className='py-3'>
        <Typography variant='h4' color='error'>
          <ConstructionIcon fontSize='large'></ConstructionIcon>
          THIS PAGE IS UNDER CONSTRUCTION
        </Typography>
      </div>
    </main>
  );
}
