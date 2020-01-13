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
        require.resolve("babel-loader"),
        require.resolve("react-docgen-typescript-loader"),
        // require.resolve("babel-plugin-typescript-to-proptypes"),
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
    {
      name: '@storybook/preset-typescript',
      options: {
        tsLoaderOptions: {
          configFile: path.resolve(__dirname, '../tsconfig.json'),
          transpileOnly: true
        },
        tsDocgenLoaderOptions: {
          tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
        },
        forkTsCheckerWebpackPluginOptions: {
          colors: false, // disables built-in colors in logger messages
        },
        include: [path.resolve(__dirname, '../src')],
      },
    },
    '@storybook/preset-scss'
  ]
}
