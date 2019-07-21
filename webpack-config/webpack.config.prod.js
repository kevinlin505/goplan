const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = function returnWebpackSettings(PATHS) {
  return {
    devtool: false,
    entry: [
      'core-js/fn/promise',
      'core-js/fn/object/assign',
      'core-js/fn/array/from',
      'core-js/fn/object/entries',
      'core-js/fn/object/values',
      'core-js/es6/string',
      'core-js/es7/array',
      PATHS.index,
    ],
    mode: 'production',
    output: {
      path: PATHS.dist,
      filename: '[name].min.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new CaseSensitivePathsPlugin(),
    ],
  };
};
