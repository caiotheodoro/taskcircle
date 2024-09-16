/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com', protocol: 'https' },
      { hostname: 'lh3.googleusercontent.com', protocol: 'https' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      }),
    );

    return config;
  },
};

module.exports = nextConfig;
