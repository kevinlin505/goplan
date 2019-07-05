const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = function returnWebpackSettings(PATHS, env) {
  let mode;
  let filename;

  if (env.minify === 'true') {
    filename = 'bundle.min.js';
    mode = 'production';
  } else {
    filename = 'bundle.js';
    mode = 'development';
  }

  return {
    entry: {
      bundle: PATHS.index,
      experience: [
        'core-js/fn/object/assign',
        'core-js/fn/array/from',
        'core-js/es6/string',
        'core-js/es7/array',
      ],
    },
    mode,
    output: {
      filename,

      /*
        updating the output path based on the NODE_ENV flag since we want to test with the
        actual bundle but don't want to pollute dist/ with anything test related
      */
      path: PATHS.dist,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(
            process.env.NODE_ENV ? process.env.NODE_ENV : 'production',
          ),
        },
      }),

      new CaseSensitivePathsPlugin(),
    ],
  };
};
