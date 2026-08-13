/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Silence the "multiple lockfiles" warning caused by the monorepo structure.
    // Note: __dirname is not available in ES modules (.mjs), use import.meta.dirname instead.
    root: import.meta.dirname,
  },
};

export default nextConfig;
