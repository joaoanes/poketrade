/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    env: {
        S3_BUCKET_URL: process.env.S3_BUCKET_URL
    }
};

export default nextConfig;
