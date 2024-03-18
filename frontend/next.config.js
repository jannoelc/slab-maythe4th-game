/** @type {import('next').NextConfig} */
const webpack = require("webpack");
const { parsed: env } = require("dotenv").config();
const withLess = require("next-with-less");

const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(env));
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:slug*",
        destination: "https://api.slab-bg.club/:slug*",
      },
    ];
  },
};

module.exports = withLess(nextConfig);
