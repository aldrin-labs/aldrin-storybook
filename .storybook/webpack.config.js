const webpackMerge = require('webpack-merge')
const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const webpack = require('webpack')

module.exports = (baseConfig, env) => {
  const config = {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@components': path.join(__dirname, '..', 'src', 'components'),
        '@styles': path.join(__dirname, '..', 'src', 'styles'),
        '@icons': path.join(__dirname, '..', 'src', 'icons'),
        '@utils': path.join(__dirname, '..', 'src', 'utils'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            'babel-loader',
            require.resolve('react-docgen-typescript-loader'),
          ],
        },
        {
          test: /\.svg$/,
          loader: 'svg-url-loader',
          options: {
            limit: 4096, // 4kb
          },
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          loaders: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {},
            },
          ],
        },
      ],
    },
    // plugins: [
    // new HardSourceWebpackPlugin(),
    // Add module names to factory functions so they appear in browser profiler.
    // new webpack.NamedModulesPlugin(),
    // ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
  }

  const mergedConfig = webpackMerge(baseConfig, config)
  return mergedConfig
}
