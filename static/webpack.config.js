var path = require('path')
var webpack = require('webpack')
var AssetsPlugin = require('assets-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

module.exports = {
  entry: {
    main: './static/src/pages/main.js',
    backend: './static/src/pages/backend.js',
    vendor: ['mavon-editor']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/static/dist/',
    filename: '[name].build.[hash].js',
    libraryTarget: "umd"
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vue-resource': 'VueResource'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'common',
      chunks: ['main', 'backend'],
      filename: 'common.bundle.[hash].js',
      minChunks: 2
    }),
    new CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['common'],
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    new AssetsPlugin({
      filename: 'static/dist/webpack.assets.js',
      processOutput: function(assets) {
        return 'window.WEBPACK_ASSETS='+JSON.stringify(assets);
      }
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = false
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
