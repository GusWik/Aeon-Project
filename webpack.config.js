const webpack = require('webpack')
const inlineLimit = 6 * 1024
const HtmlWebPackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './_index',
  js: ['js/vendor.bundle.js'],
})
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const MODE = 'development' // 開発：'development'、公開：'production'
const path = require('path')
// const enableSourceMap = (MODE === 'development')

const HttpsProxyAgent = require('https-proxy-agent')
const HttpProxyAgent = require('http-proxy-agent')
const API_SERVER = 'https://mypage-stg.aeonmobile.jp'
//
const vendorManifest = require('./dist/js/vendor-manifest.json')

module.exports = (env, argv) => {
  const is_development = argv.mode === 'development'
  return {
    devtool: is_development ? 'cheap-module-eval-source-map' : 'sourcemap',
    entry: './src/index.js',
    output: {
      // filename: 'bundle.js',
      // path: path.resolve(__dirname, 'dist')
      filename: is_development ? 'js/bundle.js' : 'js/app-[hash]-bundle.js',
      path: path.resolve('dist'),
      publicPath: '/',
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: { minimize: true },
              },
            ],
          }),
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  url: false,
                  minimize: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                  plugins: [
                    // Autoprefixer
                    // require('autoprefixer')({grid: true})
                    require('autoprefixer')({
                      browsers: ['last 2 versions', 'Android >= 4', 'iOS >= 8'],
                    }),
                  ],
                },
              },
              'sass-loader',
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
          test: /\.(jpe?g|png|gif|svg|ico)(\?.+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: './images/[name].[ext]',
            },
          },
        },
      ],
    },
    devServer: {
      host: '0.0.0.0',
      port: 8081,
      contentBase: ['dist', './'],
      historyApiFallback: {
        rewrites: [
          { from: /^\/*/, to: '/index.html' }
        ],
      },
      headers: { 'Access-Control-Allow-Origin': '*' },
      disableHostCheck: true,
      openPage: "login",
      proxy: {
        '/api': {
          target: API_SERVER,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: true,
          autoRewrite: true,
        },
        '/pg': {
          target: API_SERVER,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: true,
          autoRewrite: true,
        },
        '/register/json': {
          target: API_SERVER,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: true,
          autoRewrite: true,
        }
      },
    },
    plugins: [
      new ExtractTextPlugin(
        is_development ? 'css/bundle.css' : 'css/app-[hash].css'
      ),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: is_development ? './index.html' : './_index',
        js: ['js/vendor.bundle.js'],
      }),
      new webpack.DllReferencePlugin({
        manifest: vendorManifest,
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: process.cwd(),
        },
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: true,
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
}
