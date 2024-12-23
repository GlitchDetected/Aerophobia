/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        WEBHOOK_URL: process.env.WEBHOOK_URL,
    },
};

export default nextConfig;