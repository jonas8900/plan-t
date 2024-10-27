import withPWAInit from 'next-pwa';

/** @type {import('next').NextConfig} */
const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig)
