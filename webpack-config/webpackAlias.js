const path = require('path');

module.exports = function returnWebpackAliases(PATHS) {
  return {
    '@app': PATHS.root,
    '@components': path.resolve(PATHS.src, 'components'),
    '@utils': path.resolve(PATHS.src, 'utils'),
  };
};