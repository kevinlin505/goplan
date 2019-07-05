const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function returnWebpackSettings(PATHS, env) {
  let filename;

  if (env.minify === 'true') {
    filename = 'bundle.min.js';
  } else {
    filename = 'bundle.js';
  }

  return 
};
