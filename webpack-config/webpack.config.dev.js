const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function returnWebpackSettings(PATHS) {
  return {
    devtool: 'inline-source-map',
    entry: {
      app: [
        'core-js/fn/promise',
        'core-js/fn/object/assign',
        'core-js/fn/array/from',
        'core-js/fn/object/entries',
        'core-js/fn/object/values',
        'core-js/es6/string',
        'core-js/es7/array',
        'react-hot-loader/patch', // active HMR for react
        'webpack-dev-server/client?http://localhost:3000', // local dev server host and port
        'webpack/hot/only-dev-server', // only reloads on successful builds
        PATHS.index,
      ],
    },
    output: {
      filename: '[name].js',
      publicPath: '/',
    },
    plugins: [
      // flips webpack server to hot mode
      new webpack.HotModuleReplacementPlugin(),

      // more readable names
      new webpack.NamedModulesPlugin(),

      // if errors, do not emit files
      new webpack.NoEmitOnErrorsPlugin(),

      new HtmlWebpackPlugin({
        template: 'src/index.tpl.ejs',
        inject: 'body',
        filename: 'index.html',
        favicon: 'src/assets/favicon.ico',
      }),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
        },
      }),

      // validate case of file paths
      new CaseSensitivePathsPlugin(),
    ],
    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
      contentBase: PATHS.dist,

      // It suppress error shown in console, so it has to be set to false.
      quiet: false,

      // console log gets a bit messy so we suppress some of the default options
      stats: {
        colors: true,
        version: false,
        hash: false,
      },
    },
  };
};
