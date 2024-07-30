/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'main--transcendent-monstera-558671.netlify.app',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
