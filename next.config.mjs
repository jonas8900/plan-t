import withPWAInit from 'next-pwa';

/** @type {import('next').NextConfig} */
const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
      
        protocol: 'https',
        hostname: 'unique-plant-image-bucket.s3.eu-north-1.amazonaws.com',
        pathname: '/plants/**', 
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', 
        pathname: '**', 
      },
    ],
  },
};

export default process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig)
