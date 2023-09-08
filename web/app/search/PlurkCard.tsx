import type { PlurkDto } from '@/dto/Plurk.dto';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function ContentCard({ plurk }: { plurk: PlurkDto }) {
  return (
    <Card key={plurk.id} elevation={2} sx={{ my: 2, maxHeight: '450px', overflowY: 'auto' }}>
      <CardContent sx={{ position: 'relative', my: 1 }}>
        <IconButton
          size='large'
          sx={{ position: 'absolute', top: 8, right: 20 }}
          href={plurk.link}
          target='_blank'
        >
          <OpenInNewIcon />
        </IconButton>

        <Typography
          variant='h6'
          fontWeight='bold'
          mb={3}
          sx={{ color: 'primary.dark' }}
        >
          <AccountCircleIcon sx={{ mx: 0.5, verticalAlign: 'text-bottom' }} />
          { plurk.owner?.displayName ?? 'plurker' }
          <Typography
            component='span'
            fontSize='0.8rem'
            mx={1}
            sx={{ opacity: 0.5, verticalAlign: 'text-bottom' }}
          >
            @{ plurk.owner?.nickName ?? 'user-id' }
          </Typography>
        </Typography>
        <Box
          sx={{ px: 1 }}
          dangerouslySetInnerHTML={{
            __html: plurk.contentHtml ?? 'empty',
          }}
        />
      </CardContent>
    </Card>
  );
}
