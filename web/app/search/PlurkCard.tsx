import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import type PlurkDto from '@plurk-search/common/dto/Plurk';

export default function ContentCard({ plurk }: { plurk: PlurkDto }) {
  return (
    <Card key={plurk.id} elevation={2} sx={{ my: 2, maxHeight: '450px', overflowY: 'auto', position: 'relative' }}>
      <CardHeader
        sx={{ color: 'primary.dark' }}
        avatar={<AccountCircleIcon />}
        title={
          <Typography variant='h6' fontWeight='bold'>
            { plurk.owner?.displayName ?? '噗主' }
            <Typography component='span' fontSize='0.8rem' mx={1} sx={{ opacity: 0.5 }}>
              @{ plurk.owner?.nickName ?? 'id' }
            </Typography>
          </Typography>
        }
      />
      <CardContent sx={{ pt: 0, mb: 1 }}>
        <Box
          sx={{ px: 1 }}
          dangerouslySetInnerHTML={{
            __html: plurk.contentHtml ?? 'empty',
          }}
        />
      </CardContent>

      <IconButton
        size='large'
        sx={{ position: 'absolute', top: 8, right: 20 }}
        href={plurk.link}
        target='_blank'
      >
        <OpenInNewIcon />
      </IconButton>
    </Card>
  );
}
