/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/search',
        missing: [
          {
            type: 'cookie',
            key: 'authToken',
          },
        ],
        destination: '/auth',
        permanent: false,
      },
    ];
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
