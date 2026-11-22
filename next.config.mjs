/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next 16.4 writes an AGENTS.md file into the repo on every dev start. Not wanted here.
  agentRules: false,
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
