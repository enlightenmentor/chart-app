const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const createDefaultConfig = require('@open-wc/building-webpack/default-config');

const defaultConfig = createDefaultConfig({
  indexJS: path.resolve(__dirname, './src/index.js'),
});

const config = Object.assign({}, defaultConfig, {
  plugins: defaultConfig.plugins.concat([
    new CopyWebpackPlugin([{
      from: 'assets/',
      to: 'assets/',
    }, {
      from: 'manifest.webmanifest',
      to: 'manifest.webmanifest',
    }]),
    new SWPrecacheWebpackPlugin({
      cacheId: 'telegram-chart-app',
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'sw.js',
      minify: true,
      navigateFallback: '/',
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    })
  ])
});

module.exports = config;