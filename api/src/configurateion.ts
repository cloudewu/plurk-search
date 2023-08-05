import { isNullish } from './common/util';

export default () => {
  const protocol: string = process.env.PROTPCOL ?? 'http';
  const hostname: string = process.env.HOSTNAME ?? 'localhost';
  const port: number = parseInt(process.env.PORT ?? '9981', 10);
  let baseUrl = `${protocol}://${hostname}`;
  if (!isNullish(port)) baseUrl += `:${port}`;

  return {
    hostname,
    port,
    baseUrl,
  };
};
