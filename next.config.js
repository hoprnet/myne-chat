/** @type {import('next').NextConfig} */
const rewrites = () => {
    return [
        {
            source: "/api/v2/:path*",
            destination: `${process.env.HOPR_NODE_HTTP_URL || 'http://localhost:13301'}/api/v2/:path*`,
        },
    ];
};

module.exports = {
  reactStrictMode: true,
  rewrites,
  env: {
    NEXT_PUBLIC_MYNE_CHAT_GIT_HASH: process.env.MYNE_CHAT_GIT_HASH,
    NEXT_PUBLIC_MYNE_CHAT_ENVIRONMENT: process.env.NODE_ENV
  }
};
