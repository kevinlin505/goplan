const path = require('path');

module.exports = function returnWebpackAliases(PATHS) {
  return {
    '@app': PATHS.root,
    '@components': path.resolve(PATHS.src, 'components'),
    '@providers': path.resolve(PATHS.src, 'providers'),
    '@store': path.resolve(PATHS.src, 'store'),
    '@utils': path.resolve(PATHS.src, 'utils'),
  };
};
