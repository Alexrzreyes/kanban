/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },

  // GitHub Pages serves from https://alexrzreyes.github.io/kanban/
  // so basePath and assetPrefix must match the repo name.
  basePath: '/kanban',
  assetPrefix: '/kanban',
};

export default nextConfig;
