const webpack = require('webpack')
const merge = require("webpack-merge")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const baseConfig = require("./webpack.base.js")

module.exports = merge(baseConfig, {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new UglifyJSPlugin()
  ]
})