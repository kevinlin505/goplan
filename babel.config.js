module.exports = api => {
  api.cache(true);

  return {
    presets: [
      ['@babel/preset-env', { debug: false, modules: false }],
      '@babel/preset-react',
    ],

    plugins: [
      // es7 class properties
      '@babel/plugin-proposal-class-properties',

      // object rest/spread support
      '@babel/plugin-proposal-object-rest-spread',

      [
        '@babel/plugin-transform-runtime',
        {
          // rewrites the helpers that need polyfillable APIs to reference core-js
          corejs: 2,
          helpers: true,
          regenerator: true,
          useESModules: true,
        },
      ],
    ],

    env: {
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              modules: 'cjs',
            },
          ],
        ],
      },
      development: {
        presets: [['@babel/preset-react', { development: true }]],
        plugins: [
          // enables react to work with HMR
          'react-hot-loader/babel',

          // styled-components pre-processing
          'babel-plugin-styled-components',
        ],
      },
      production: {
        presets: ['@babel/preset-react'],
        plugins: [
          // styled-components pre-processing
          [
            'babel-plugin-styled-components',
            {
              displayName: false,
            },
          ],
        ],
      },
      test: {
        plugins: [
          // allow Jest to work with es6 imports
          '@babel/plugin-transform-modules-commonjs',

          // styled-components pre-processing
          'babel-plugin-styled-components',
        ],
      },
    },
  };
};
