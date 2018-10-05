const webpackMerge = require('webpack-merge');
const path = require('path');

module.exports = (baseConfig, env) => {
  const config = {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@components': path.join(__dirname, '..', 'src', 'components'),
        '@styles': path.join(__dirname, '..', 'src', 'styles'),
        '@icons': path.join(__dirname, '..', 'src', 'icons'),
        '@utils': path.join(__dirname, '..', 'src', 'utils')
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            'babel-loader',
            require.resolve("react-docgen-typescript-loader"),
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
          loaders: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        }
      ],
    },
  }

  const mergedConfig = webpackMerge(
    baseConfig,
    config,
  );
  return mergedConfig;
};