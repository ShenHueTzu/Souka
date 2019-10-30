const webpack = require('webpack');
const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  cssModules: true,

  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(txt|jpg|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              context: '',
              emitFile: true,
              name: '[path][name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: {
          loader: 'url-loader',
          options: {
            name: 'static/icons/[name].[ext]',
            limit: 10240,
          },
        },
      }
    );

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.ENV': JSON.stringify(process.env.ENV),
        __CLIENT__: true,
      }),
    );
    return config;
  },
});
