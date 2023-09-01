import LoopIcon from '@mui/icons-material/Loop';

export default function LoadingIcon({
  width,
  height,
  center,
  color,
}: {
  width?: number
  height?: number
  center?: boolean
  color?: string
}) {
  return (
    <LoopIcon
      color='primary'
      sx={{
        color: color ?? 'primary',
        width: width ?? 50,
        height: height ?? 50,
        animation: 'spin 1.5s infinite',
        '@keyframes spin': {
          '0%': {
            transform: 'rotate(360deg)',
          },
          '100%': {
            transform: 'rotate(0deg)',
          },
        },
      }}
    />
  );
}
