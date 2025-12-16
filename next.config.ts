import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.freepik.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lms-be-assets-dev.s3.ap-southeast-1.amazonaws.com',
                port: '',
                pathname: '/uploads/**',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                // When the frontend calls /api-backend/...,
                // Vercel forwards it to your HTTP backend.
                source: '/api-backend/:path*',
                destination: 'http://52.221.217.63:8081/:path*',
            },
        ]
    }
};

export default nextConfig;
