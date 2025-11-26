import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lms-be-assets-dev.s3.ap-southeast-1.amazonaws.com',
                port: '',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
