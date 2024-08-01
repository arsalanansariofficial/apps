/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This setting enables the use of custom .babelrc without the exception message
    forceSwcTransforms: true
  }
};

export default nextConfig;
