/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate a standalone folder which copies only the necessary files for production
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/files/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/inmuebles/**',
      },
    ],
    unoptimized: true, // Deshabilitar optimización para desarrollo
  },
};

export default nextConfig;