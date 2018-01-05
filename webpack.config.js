var path = require('path')
var fs = require('fs')
var webpack = require('webpack')
var AssetsPlugin = require('assets-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

// 先将dist/static/js和dist/static/assets清空
function deleteall(path) {
  var files = []
  if(fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function(file, index) {
      var curPath = path + "/" + file
      if(fs.statSync(curPath).isDirectory()) {
        deleteall(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}
deleteall(path.join(__dirname, './dist/static/assets'))
deleteall(path.join(__dirname, './dist/static/js'))

module.exports = {
  entry: {
    'js/main': './static/pages/main.js',
    'js/backend': './static/pages/backend.js',
    vendor: ['mavon-editor']
  },
  output: {
    path: path.resolve(__dirname, './dist/static'),
    publicPath: '/',
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
          name: 'assets/[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'common',
      chunks: ['js/main', 'js/backend'],
      filename: 'js/common.bundle.[hash].js',
      minChunks: 2
    }),
    new CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['common'],
      filename: 'js/vendor.bundle.js',
      minChunks: Infinity
    }),
    new AssetsPlugin({
      path: './dist/static/js',
      filename: 'webpack.assets.js',
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
    overlay: true,
    contentBase: './dist/static',
    open: 'http://localhost:80/'
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

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
