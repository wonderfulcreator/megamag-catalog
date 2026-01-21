/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    // next/image default loader isn't compatible with static export
    // (we use <img> anyway, but this avoids surprises if you add next/image later)
    unoptimized: true,
  },
};

export default nextConfig;
