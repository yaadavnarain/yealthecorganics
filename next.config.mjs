/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async rewrites() {
    return [
      // Serve the password-gated off-grid solar tool at a clean URL.
      // Auth is enforced in middleware.ts before this rewrite resolves.
      {
        source: "/pvcalculatoroffgrid",
        destination: "/tools/pvcalculator.html",
      },
      // Public dividends calculator, served as a static file at a clean URL.
      {
        source: "/calculator",
        destination: "/tools/dividends-calculator.html",
      },
    ];
  },
};

export default nextConfig;
