const path = require('path');

module.exports = {
  webpack: (config) => {
    if (!config.module) {
      config.module = { rules: [] }
    }

    if (!config.module.rules) {
      config.module.rules = []
    }

    config.module.rules.push({
      test: /\.tsx?$/,
      include: path.resolve(__dirname, "../src"),

      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            compiler: 'ttypescript'
          }
        },
        {
          loader: require.resolve("react-docgen-typescript-loader"),
          options: {
            skipPropsWithoutDoc: false,
            tsconfigPath: './tsconfig.json'
          }
        }
      ],
    });
   
    config.resolve.extensions.push(".ts", ".tsx");
   
    return config;
  },
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
      },
    },
  ],
  presets: [
    '@storybook/preset-scss'
  ]
}
