const path = require('path')
const webpack = require('webpack')
const inlineLimit = 6 * 1024
const outputPath = path.join(__dirname, 'dist')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    vendor: [
      'chart.js',
      'jquery',
      'prop-types',
      'react',
      'react-chartjs-2',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'react-router-prop-types',
      'react-slick',
      'recharts',
      'redux',
      'redux-thunk',
      'slick-carousel',
      'whatwg-fetch',
      'google-libphonenumber',
      'tui-image-editor',
    ],
  },
  externals: [],
  output: {
    path: outputPath + '/js/',
    filename: '[name].bundle.js',
    library: '[name]_library',
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: [/node_modules\/react.*\//, /node_modules\/lodash.*\//],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: { sourceMap: true },
          },
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: { discardComments: { removeAll: true } },
                sourceMap: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: { sourceMap: true },
          },
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: { discardComments: { removeAll: true } },
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        }),
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: inlineLimit,
              mimetype: 'application/font-woff',
              outputPath: 'vendorResource/',
            },
          },
        ],
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: inlineLimit,
              mimetype: 'application/font-woff',
              outputPath: 'vendorResource/',
            },
          },
        ],
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: inlineLimit,
              mimetype: 'application/octet-stream',
              outputPath: 'vendorResource/',
            },
          },
        ],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: inlineLimit,
              mimetype: 'application/octet-stream',
              outputPath: 'vendorResource/',
            },
          },
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: inlineLimit,
              mimetype: 'image/svg+xml',
              outputPath: 'vendorResource/',
            },
          },
        ],
      },
      {
        test: /\.png$/,
        use: [{ loader: 'url-loader', options: { mimetype: 'image/png' } }],
      },
      {
        test: /\.gif$/,
        use: [{ loader: 'url-loader', options: { mimetype: 'image/gif' } }],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin('css/[name].bundle.css'),
    new webpack.DefinePlugin({
      'process.env': {
        STYLUS_COV: false,
        COV: false,
      },
    }),
    new webpack.DllPlugin({
      path: path.join(outputPath, 'js/[name]-manifest.json'),
      name: '[name]_library',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            drop_console: true,
          },
          sourceMap: true,
        },
        sourceMap: true,
      }),
    ],
  },
}
