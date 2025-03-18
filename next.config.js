/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: require.resolve('./src/lib/process-polyfill.js'),
      };
    }
    return config;
  },
};

module.exports = nextConfig; 