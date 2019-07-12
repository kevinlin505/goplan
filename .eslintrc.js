const rules = {
  'arrow-body-style': 'off',
  'arrow-parens': 'off',
  'class-methods-use-this': 'off',
  'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  'import/no-named-as-default': 'off', // issue with default export of connected components
  'import/no-unresolved': 'error',
  'no-mixed-operators': 'off',
  'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  'no-return-assign': 'warn',
  'no-var': 'off',
  'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
  'prefer-destructuring': 'warn',
  radix: ['error', 'as-needed'],

  // React-specific
  'react/destructuring-assignment': 'warn',
  'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  'react/jsx-sort-props': [
    1,
    {
      reservedFirst: true,
    },
  ],
  'react/forbid-prop-types': 'off',
  'react/no-array-index-key': 'off',
  'react/no-did-mount-set-state': 'off',
  'react/no-will-update-set-state': 'warn',
  'react/no-did-update-set-state': 'off',
  'react/sort-comp': [
    2,
    {
      order: [
        'static-methods',
        'instance-variables',
        'lifecycle',
        'everything-else',
        'render',
      ],
    },
  ],
};

module.exports = {
  /*
    "plugin:prettier/recommended"
      - enables eslint-plugin-prettier
      - extends eslint-config-prettier
      - sets rule "prettier/prettier": "error" - tells ESlint to run prettier on `--fix`
  */
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
  ],

  parser: 'babel-eslint',

  plugins: ['import', 'react-hooks'],

  root: true,

  globals: {
    window: false,
    document: false,
    fetch: false,
  },

  env: {
    browser: true,
  },

  overrides: [
    {
      files: ['**/webpack*'],
      rules: {
        ...rules,
        'global-require': 'off',
        'import/no-dynamic-require': 'off',
        'import/prefer-default-export': 'off',
        'react/prop-types': 'off',
      },
    },
  ],

  rules: rules,

  settings: {
    'import/resolver': {
      alias: [
        ['@assets', './src/assets'],
        ['@components', './src/components'],
        ['@constants', './src/constants'],
        ['@data', './src/data'],
        ['@providers', './src/providers'],
        ['@store', './src/store'],
        ['@styles', './src/styles'],
        ['@utils', './src/utils'],
      ],
    },
  },
};
