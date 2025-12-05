const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    reactStrictMode: true,
    transpilePackages: ["@leaseqa/ui"],
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:4000/api/:path*", // Proxy to Backend
            },
        ];
    },
};

export default nextConfig;
