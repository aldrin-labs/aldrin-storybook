const { merge } = require('webpack-merge')
const path = require('path')
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const webpack = require('webpack')

module.exports = (baseConfig, env, ...rest) => {

  const platform = process.env.PLATFORM || 'web'



  const config = {
    devtool: 'eval-cheap-module-source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@storage': path.join(__dirname, '..', 'src', 'core', 'src', 'mocks'),
        '@core': path.join(__dirname, '..', 'src', 'core', 'src'),
        '@sb': path.join(__dirname, '..', 'src', `${platform}`),
        '@components': path.join(__dirname, '..', 'src', `${platform}`, 'components'),
        '@compositions': path.join(__dirname, '..', 'src', `${platform}`, 'compositions'),
        '@config': path.join(__dirname, '..', 'src', `${platform}`, 'config'),
        '@styles': path.join(__dirname, '..', 'src', `${platform}`, 'styles'),

        '@icons': path.join(__dirname, '..', 'src', 'icons'),
        '@utils': path.join(__dirname, '..', 'src', 'utils'),
        '@nodemodules': path.resolve(__dirname, '..', 'node_modules'),
      },
      fallback: {
        fs: false,
        os: false,
        path: false,
        net: false,
        tls: false,
        child_process: false,
      },
    },
    optimization: {
      moduleIds: 'named'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [
            path.join(__dirname, '..', '/node_modules/'),
            path.join(__dirname, '..', '/src/core/node_modules/'),

          ],
          use: ['babel-loader?cacheDirectory=true'],
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
          use: ['style-loader', 'css-loader'],
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
    plugins: [
      // new HardSourceWebpackPlugin(),
      // Add module names to factory functions so they appear in browser profiler.
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    // node: {
    //   dgram: 'mock',
    //   fs: 'mock',
    //   net: 'mock',
    //   tls: 'mock',
    //   child_process: 'mock',
    // },
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
  }

  const mergedConfig = merge(baseConfig, config)
  return mergedConfig
}
