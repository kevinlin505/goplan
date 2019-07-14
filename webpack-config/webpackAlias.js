const path = require('path');

module.exports = function returnWebpackAliases(PATHS) {
  return {
    '@app': PATHS.root,

    // sub-directories under src
    '@assets': path.resolve(PATHS.src, 'assets'),
    '@components': path.resolve(PATHS.src, 'components'),
    '@constants': path.resolve(PATHS.src, 'constants'),
    '@data': path.resolve(PATHS.src, 'data'),
    '@hooks': path.resolve(PATHS.src, 'hooks'),
    '@providers': path.resolve(PATHS.src, 'providers'),
    '@store': path.resolve(PATHS.src, 'store'),
    '@styles': path.resolve(PATHS.src, 'styles'),
    '@utils': path.resolve(PATHS.src, 'utils'),
  };
};
