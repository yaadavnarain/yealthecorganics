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
  async redirects() {
    return [
      // TEMP-HIDE-CALCULATOR (figures being corrected) — remove this block to restore the Calculator
      {
        source: "/calculator",
        destination: "/",
        permanent: false, // 307 temporary — do NOT make permanent
      },
    ];
  },
  async rewrites() {
    return [
      // Serve the password-gated off-grid solar tool at a clean URL.
      // Auth is enforced in middleware.ts before this rewrite resolves.
      {
        source: "/pvcalculatoroffgrid",
        destination: "/tools/pvcalculator.html",
      },
    ];
  },
};

export default nextConfig;
