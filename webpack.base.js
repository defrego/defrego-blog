const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin')         // 生成bundle信息json
const VueLoaderPlugin = require('vue-loader/lib/plugin')      // vue的loader
const CopyWebpackPlugin = require('copy-webpack-plugin')      // 复制一些东西
const {CleanWebpackPlugin} = require('clean-webpack-plugin')  // 清空dist

const resolve = dir => path.resolve(__dirname, dir);
const join = dir => path.join(__dirname, dir);

const webpackConfig = {
  mode: 'none',
  entry: {
    'main': ['./src/browser/pages/main/main.js'],
    'backend': ['./src/browser/pages/backend/backend.js']
  },
  output: {
    path: resolve('dist/static'),
    publicPath: '/',
    filename: '[name].build.[hash].js',
    libraryTarget: 'umd'
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
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {}
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules|src\/server/
      },
      {
        test: /favicon\.ico$/,
        loader: 'file-loader',
        options: {
          outputPath: 'static/',
          name: 'favicon.ico'
        }
      },
      {
        test: /\.(png|jpg|gif|ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        options: {
          name: 'static/assets/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.svg$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new AssetsPlugin({
      path: 'dist/static',
      filename: 'webpack.assets.js',
      keepInMemory: true,
      processOutput: function(assets) {
        return 'window.WEBPACK_ASSETS='+JSON.stringify(assets, undefined, 2);
      }
    }),
    new CopyWebpackPlugin([
      {
        from: join('src/server'),
        to: resolve('dist/koa'),
        toType: 'dir'
      }, {
        from: join('src/browser/assets/favicon.ico'),
        to: join('dist/static/favicon.ico'),
        toType: 'file'
      }, {
        from: join('src/browser/index.html'),
        to: join('dist/static/index.html'),
        toType: 'file'
      }, {
        from: join('src/browser/pages/main/main.html'),
        to: join('dist/static/main.html'),
        toType: 'file'
      }, {
        from: join('src/browser/pages/backend/backend.html'),
        to: join('dist/static/backend.html'),
        toType: 'file'
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '.'
      // cacheGroups: {
      //   vendor_common: {
      //     name: 'vendor_common',
      //     test: /browser/,
      //     minSize: 102400,
      //     priority: 5
      //   },
      //   vendor_mavon_editor: {
      //     name: 'vendor_mavon_editor',
      //     test: /mavon-editor/,
      //     priority: 10
      //   }
      // }
    }
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src/browser'),
      '@pages': resolve('src/browser/pages'),
      '@modules': resolve('src/browser/modules'),
      '@components': resolve('src/browser/components')
    },
    extensions: ['*', '.js', '.vue', '.json']
  }
}

module.exports = webpackConfig
