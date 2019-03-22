const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const createDefaultConfig = require('@open-wc/building-webpack/modern-config');

const development = !process.argv.find(arg => arg.includes('production'));

const defaultConfig = createDefaultConfig({
  entry: path.resolve(__dirname, './src/index.js'),
  indexHTML: path.resolve(__dirname, './index.html'),
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
    !development && new SWPrecacheWebpackPlugin({
      cacheId: 'telegram-chart-app',
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'sw.js',
      minify: true,
      navigateFallback: '/',
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    })
  ]).filter(_ => !!_)
});

module.exports = config;