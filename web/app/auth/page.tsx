import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

export default function AuthPage() {
  return (
    <Box>
      <Typography>
        由於時間軸為私人資料，我們需要取得使用者河道的存取權限，才能進行搜尋。
      </Typography>
      <Typography>
        如果你願意授權給本網頁的話，請點擊下方按鈕開始授權，我們會將你導向噗浪登入頁面，請按照頁面指示獲取六位數字的驗證碼後，將驗證碼填寫至下方輸入框。
      </Typography>
      <Typography variant='h6' color='error' my={2}>
        注意！被授權的應用程式有能力得到<strong>所有</strong>使用者資料，授權任何應用程式前請<strong>務必確認您信任該程式</strong>。
      </Typography>
      <Typography>
        我們（時光機Plus）承諾不會儲存、紀錄、閱覽任何使用者隱私內容，但可能會紀錄部分資訊供除錯使用。會被紀錄的內容如下：授權時間，搜尋字串，搜尋到的結果數量。
      </Typography>

      <NextLink href='/auth/login' passHref>
        <Button variant='contained' size='large' sx={{ my: 2 }}>登入驗證</Button>
      </NextLink>
    </Box>
  );
};
