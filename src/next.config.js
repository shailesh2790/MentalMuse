// next.config.js
const path = require('path');

module.exports = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts'],
  webpack(config) {
    config.resolve.alias = {
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  trailingSlash: false,
  experimental: {
    appDir: false
  }
};