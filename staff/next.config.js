/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["sahaj-nepal.s3.us-east-2.amazonaws.com"],
  },
  async redirects() {
    return [{ source: "/", destination: "/login", permanent: true }];
  },
};

module.exports = nextConfig;
