const webpackMerge = require('webpack-merge');
const path = require('path')
// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js')

const config = {
  resolve: {
    extensions: ['.ts', '.tsx'],
    alias: {
      '@components': path.join(__dirname, '..', 'src', 'components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: require.resolve('awesome-typescript-loader')
      }
    ],
  },
}

module.exports = (baseConfig, env) => {
  const  mergedConfig = webpackMerge(
    genDefaultConfig(baseConfig, env),
    config,
  );
  return mergedConfig;
}
