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
};

export default nextConfig;
