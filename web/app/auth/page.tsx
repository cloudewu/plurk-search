import NavButton from '@/components/NavButton';
import SectionTitle from '@/components/SectionTitle';
import TextBold from '@/components/TextStrong';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

export default function AuthPage() {
  const startButtonText = '登入驗證';

  return (
    <Box>
      <SectionTitle>
        這是什麼？
      </SectionTitle>
      <Typography>
        由於時間軸為私人資料，我們需要瀏覽使用者河道的權限，才能進行搜尋。
      </Typography>

      <SectionTitle>
        我該怎麼做？
      </SectionTitle>
      <Stepper orientation='vertical'>
        <Step active>
          <StepLabel>點擊頁面最下方的「{startButtonText}」按鈕，開始授權程序。</StepLabel>
        </Step>
        <Step active>
          <StepLabel>跳轉至授權頁後，請點擊頁面顯示的連結（由噗浪官方提供），前往噗浪進行驗證。噗浪可能會要求您進行登入。</StepLabel>
        </Step>
        <Step active>
          <StepLabel>依噗浪指示，取得六位數字的驗證碼。</StepLabel>
        </Step>
        <Step active>
          <StepLabel>回到本網站，於輸入框填寫驗證碼後送出。</StepLabel>
        </Step>
      </Stepper>

      <SectionTitle>
        有什麼要注意的嗎？
      </SectionTitle>
      <Typography>
        本網站使用
        {' '}
        <Link href='https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies'>Cookie</Link>
        {' '}
        來紀錄您的授權碼，以進行河道搜尋。
      </Typography>
      <Typography>
        Cookie 保存期限為七天，所以在同一個瀏覽器中，您每七天必需重新登入一次。
      </Typography>
      <Typography>
        另外 Cookie 無法跨裝置共用，所以每當您使用不同裝置、瀏覽器、或者手動清除 Cookie 之後，皆須重新申請授權，且新授權會導致原本的授權失效。
      </Typography>

      <NavButton
        href='/auth/login'
        variant='contained'
        size='large'
        sx={{ my: 2 }}
      >
        { startButtonText }
      </NavButton>

      <Typography variant='h6' color='error' my={2}>
        注意！被授權的應用程式有能力得到<TextBold weight={600}>所有</TextBold>使用者資料，
        授權任何應用程式前請<TextBold>務必確認您信任該程式</TextBold>。
      </Typography>
    </Box>
  );
};
