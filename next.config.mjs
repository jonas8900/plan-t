import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  importScripts: ["/service-worker.js"],
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unique-plant-images-bucket.s3.eu-central-1.amazonaws.com",
        pathname: "/plants/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
};

export default process.env.NODE_ENV === "development"
  ? nextConfig
  : withPWA(nextConfig);
