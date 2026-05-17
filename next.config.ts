import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    experimental: {
        scrollRestoration: true,
        forceSwcTransforms: true,
        esmExternals: true,
    },
    productionBrowserSourceMaps: true,
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    images: {
        deviceSizes: [360, 414, 768, 1024, 1280],
        imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384, 512],
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'media.tenor.com',
            },
        ],
    },
};

export default nextConfig;
