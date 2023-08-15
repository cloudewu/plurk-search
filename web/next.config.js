/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/search',
        missing: [
          {
            type: 'cookie',
            key: 'token'
          }
        ],
        destination: '/auth',
        permanent: false
      }
    ];
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
