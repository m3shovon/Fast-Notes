/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://127.0.0.1:8888/api/:path*", 
      },
    ];
  },
};

module.exports = nextConfig;
