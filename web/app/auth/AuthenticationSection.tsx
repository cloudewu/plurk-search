'use client';

import addTokenToCookies from '@/actions/addTokenToCookies';
import LoadingIcon from '@/components/LoadingIcon';
import { type AuthResponseDto } from '@/dto/authResponse.dto';
import getFetcher from '@/lib/getFetcher';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type ChangeEventHandler, type MouseEventHandler } from 'react';

enum Status {
  IDLE,
  REQUESTING,
  AUTHENTICATING,
  VERIFYING,
  DONE,
  ERROR,
};

export default function AuthenticationSection() {
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [data, setData] = useState<AuthResponseDto | null>(null);

  const startAuthentication = async() => {
    setStatus(Status.REQUESTING);
    const data = await getFetcher<AuthResponseDto>()('/api/auth')
      .catch(e => { console.error(e); });
    if (data != null) {
      setData(data);
      void addTokenToCookies(data.token, true);
      setStatus(Status.AUTHENTICATING);
    }
  };

  const verifyToken = async(code: string) => {
    setStatus(Status.VERIFYING);
    const token = await getFetcher<string>()('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }).catch(e => { console.error(e); });
    if (token != null) {
      void addTokenToCookies(token);
      setStatus(Status.DONE);
    }
  };

  switch (status) {
    case Status.IDLE:
    case Status.REQUESTING:
      return <StartButton onClick={startAuthentication} disabled={status !== Status.IDLE} />;
    case Status.AUTHENTICATING:
    case Status.VERIFYING:
      return <AuthenticationPanel data={data} onSubmit={verifyToken} verifying={status !== Status.AUTHENTICATING} />;
    case Status.DONE:
      return <Box>done</Box>;
    default: // Status.ERROR | unknown
      return <Box>error</Box>;
  }
};

function StartButton({
  onClick,
  disabled,
}: {
  onClick?: () => Promise<void>
  disabled?: boolean
}) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    void onClick?.();
  };

  return (
    <Box>
      <Button
        variant='contained'
        size='large'
        sx={{ my: 3 }}
        onClick={handleClick}
        disabled={disabled}
        endIcon={disabled === true && <LoadingIcon width={20} height={20} />}
      >
        開始授權
      </Button>
    </Box>
  );
};

function AuthenticationPanel({
  data,
  onSubmit,
  verifying,
}: {
  data: AuthResponseDto | null
  onSubmit?: (code: string) => Promise<void>
  verifying?: boolean
}) {
  const [code, setCode] = useState<string>('');

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCode(e.currentTarget.value);
  };
  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    void onSubmit?.(code);
  };

  return (<>
    { (data != null)
      ? <>
          <Typography>
            點擊此連結以登入噗浪進行驗證：
            <Link href={ data.authLink } target='blank' rel='noopener'>{ data.authLink }</Link>
          </Typography>
          <Typography variant='caption' color='gray'>
            Token: { data.token }
          </Typography>
          <Typography>
            請在此填入六位數字驗證碼
          </Typography>
          <Box>
            <TextField id='code' size='small' inputProps={{ inputMode: 'numeric', pattern: '[0-9]{6}' }} onChange={handleInputChange} />
          </Box>
          <Button variant='contained' size='large' sx={{ my: 2 }} disabled={verifying} onClick={handleSubmit}>
            確認
          </Button>
        </>
      : <Box>error</Box>
    }
    { verifying === true && <LoadingIcon /> }
  </>);
};
