/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com'],
  },
  // Exclude functions directory from Next.js build
  webpack: (config, { isServer }) => {
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'firebase-functions': 'commonjs firebase-functions',
        'firebase-admin': 'commonjs firebase-admin',
      });
    }
    return config;
  },
}

module.exports = nextConfig

