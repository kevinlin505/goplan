const path = require('path');

module.exports = function returnWebpackAliases(PATHS) {
  return {
    '@app': PATHS.root,

    // sub-directories under src
    '@components': path.resolve(PATHS.src, 'components'),
    '@constants': path.resolve(PATHS.src, 'constants'),
    '@models': path.resolve(PATHS.src, 'models'),
    '@providers': path.resolve(PATHS.src, 'providers'),
    '@store': path.resolve(PATHS.src, 'store'),
    '@utils': path.resolve(PATHS.src, 'utils'),
  };
};
