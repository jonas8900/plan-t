import withPWAInit from 'next-pwa';
import { InjectManifest } from 'workbox-webpack-plugin';

/** @type {import('next').NextConfig} */
const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new InjectManifest({
          swSrc: './public/service-worker.js', 
          swDest: 'service-worker.js',      
        })
      );
    }
    return config;
  },
};

export default withPWA(nextConfig);
