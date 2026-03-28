/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'robertsspaceindustries.com' },
      { protocol: 'https', hostname: 'media.robertsspaceindustries.com' },
    ],
  },
};

export default nextConfig;
