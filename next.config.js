// next.config.js

const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

let didPatchEntry = false;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack(config) {
    // Node fallback polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,

      fs: false,
      path: false,
      constants: false,

      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      crypto: require.resolve("crypto-browserify"),
      querystring: require.resolve("querystring-es3"),
      zlib: require.resolve("browserify-zlib"),

      vm: require.resolve("vm-browserify"),
      buffer: require.resolve("buffer/"),
    };

    // Global Buffer support
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      })
    );

    config.plugins.push(new NodePolyfillPlugin());

    // ---------- SAFE ENTRYPOINT PATCH ----------
    if (!didPatchEntry) {
      const originalEntry = config.entry;

      config.entry = async () => {
        const entries = await originalEntry();

        if (entries["main.js"] && !entries["main.js"].includes("./polyfills.js")) {
          entries["main.js"].unshift("./polyfills.js");
        }

        return entries;
      };

      didPatchEntry = true;
    }
    // ------------------------------------------

    return config;
  },
};

module.exports = nextConfig;
