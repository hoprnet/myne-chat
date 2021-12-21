/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MYNE_CHAT_GIT_HASH: process.env.MYNE_CHAT_GIT_HASH,
    NEXT_PUBLIC_MYNE_CHAT_ENVIRONMENT: process.env.NODE_ENV
  }
};
