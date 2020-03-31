const webpack = require('webpack')
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");

module.exports = merge(baseConfig, {
  entry: {
    'main': ['webpack-hot-middleware/client'],
    'backend': ['webpack-hot-middleware/client']
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});