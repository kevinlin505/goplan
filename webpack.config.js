const path = require('path');
const webpackMerge = require('webpack-merge');

const PATHS = {
  dist: path.join(__dirname, 'dist'),
  index: path.join(__dirname, './src/index.js'),
  root: path.join(__dirname, './'),
  src: path.join(__dirname, 'src'),
  webpackConfig: path.join(__dirname, 'webpack-config'),
};

module.exports = function returnConfig(env) {
  const devWebpackConfig = require(`${PATHS.webpackConfig}/webpack.config.dev`)(
    PATHS,
  );
  const prodWebpackConfig = require(`${PATHS.webpackConfig}/webpack.config.prod`)(
    PATHS,
  );
  const webpackAliases = require(`${PATHS.webpackConfig}/webpackAlias`)(PATHS);

  const common = webpackMerge([
    {
      resolve: {
        modules: [path.join(__dirname, 'node_modules'), PATHS.src],
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
          {
            test: /\.(png|svg|jpg|gif)$/,
            include: [path.join(__dirname, 'src/assets/images')],
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: 'assets/',
                },
              },
            ],
          },
        ],
      },
    },
  ]);

  if (env.environment === 'production') {
    return webpackMerge([prodWebpackConfig, common]);
  }

  return webpackMerge([devWebpackConfig, common]);
};
