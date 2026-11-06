/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
  // Let browsers keep the artwork and videos for a week (revalidating in the background),
  // so returning guests don't download them again. File names aren't hashed, so keep this modest.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return [
      { source: "/images/:path*", headers: cache },
      { source: "/:file(wedding|weddinglaptop).:ext(mp4|webm)", headers: cache },
    ];
  },
};

export default nextConfig;
