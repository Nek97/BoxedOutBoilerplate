/* istanbul ignore file */

/* eslint-disable */

const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (options) => {
  return {
    ...options,
    resolve: {
      extensions: ['.mjs', '.ts', '.js'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, 'tsconfig.json'),
        }),
      ],
    },
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(__dirname, '../../env/dist/apps/cli'),
      filename: 'main.js',
    },
  };
};
