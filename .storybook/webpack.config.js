const webpackMerge = require('webpack-merge');
const path = require('path')

module.exports = (baseConfig, env) => {
  const config = {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@components': path.join(__dirname, '..', 'src', 'components'),
        '@styles': path.join(__dirname, '..', 'src', 'styles'),
        '@icons': path.join(__dirname, '..', 'src', 'icons'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'babel-loader?cacheDirectory=true',
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