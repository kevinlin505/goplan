const path = require('path');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  dist: path.join(__dirname, 'dist'),
  index: path.join(__dirname, './src/index.js'),
  root: path.join(__dirname, './'),
  src: path.join(__dirname, 'src'),
  webpackConfig: path.join(__dirname, 'webpack-config'),
};

module.exports = function returnConfig(env) {
  const webpackAliases = require(`${PATHS.webpackConfig}/webpackAlias`)(PATHS);

  return {
    resolve: {
      modules: [path.join(__dirname, 'node_modules'), PATHS.index, PATHS.src],
      alias: webpackAliases,
      extensions: ['.js', '.json', '.jsx'],
      symlinks: false,
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          include: [path.resolve(__dirname, 'src')],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                // must be cjs
                '@babel/plugin-transform-modules-commonjs',
              ],
            },
          },
        },
      ],
    },
    devtool: 'inline-source-map',
    entry: {
      app: [
        'whatwg-fetch',
        'core-js/fn/promise',
        'core-js/fn/object/assign',
        'core-js/fn/array/from',
        'core-js/es6/string',
        'core-js/es7/array',
        'react-hot-loader/patch', // active HMR for react
        'webpack-dev-server/client?http://localhost:3000', // local dev server host and port
        'webpack/hot/only-dev-server', // only reloads on successful builds
        PATHS.index,
      ],
    },
    mode: env.environment,
    output: {
      path: PATHS.dist,
      filename:
        env.environment === 'development' ? 'bundle.js' : 'bundle.min.js',
    },
    plugins: [
      // flips webpack server to hot mode
      new webpack.HotModuleReplacementPlugin(),

      // if errors, do not emit files
      new webpack.NoEmitOnErrorsPlugin(),

      new HtmlWebpackPlugin({
        template: 'src/index.tpl.ejs',
        inject: 'body',
        filename: 'index.html',
      }),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(
            process.env.NODE_ENV ? process.env.NODE_ENV : 'production',
          ),
        },
      }),

      // validate case of file paths
      new CaseSensitivePathsPlugin(),
    ],
    devServer: {
      port: 3000,
      hot: true,

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
