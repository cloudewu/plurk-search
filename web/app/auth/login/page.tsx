import updateCookies from '@/actions/updateCookies';
import { COOKIE_TOKEN } from '@/constants';
import type { AuthResponseDto } from '@/dto/authResponse.dto';
import Gateway from '@/lib/Gateway';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { redirect } from 'next/navigation';

const SEVEN_DAYS = 7 * 24 * 60 * 60;

export default async function Login() {
  const data: AuthResponseDto = await Gateway.getAuth();

  async function submit(formData: FormData) {
    'use server';

    const code = (formData.get('code') ?? '').toString().trim().normalize?.('NFKC');
    const token = await Gateway.postAuth(data.token, code);
    void updateCookies(
      {
        [COOKIE_TOKEN]: {
          value: token,
          secure: true,
          maxAge: SEVEN_DAYS,
        },
      },
    );
    redirect('/');
  }

  return (
    <Box component='form' action={submit as (formData: FormData) => void}>
      <Typography>
        點擊此連結以登入噗浪進行驗證：
        <Link href={ data.authLink } target='blank' rel='noopener'>{ data.authLink }</Link>
      </Typography>

      <Typography sx={{ verticalAlign: 'center' }}>
        請在此填入六位數字驗證碼：
      </Typography>

      <TextField
        required
        name='code'
        size='small'
        inputProps={{ inputMode: 'numeric', pattern: '\\s*[0-9\uFF10-\uFF19]{6}\\s*' }}
        sx={{ my: 2, display: 'block' }}
      />

      <Button variant='contained' type='submit' size='large' sx={{ my: 2 }}>
        驗證
      </Button>
    </Box>
  );
};
