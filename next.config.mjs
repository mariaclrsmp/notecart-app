/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '**',
            },
        ],
        dangerouslyAllowSVG: true,
        unoptimized: true,
    },
};

export default nextConfig;
