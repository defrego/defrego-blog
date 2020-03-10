const express = require('express')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require("webpack-hot-middleware")
let config = require('../webpack.config.js')

// if (process.env.NODE_ENV === 'production') {
//   webpackConfig.devtool = false
//   // http://vue-loader.vuejs.org/en/workflow/production.html
//   webpackConfig.plugins = (webpackConfig.plugins || []).concat([
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: ''production''
//       }
//     }),
//     new webpack.optimize.UglifyJsPlugin({
//       sourceMap: true,
//       compress: {
//         warnings: false
//       }
//     }),
//     new webpack.LoaderOptionsPlugin({
//       minimize: true
//     })
//   ])
// }

config.plugins.push(new webpack.HotModuleReplacementPlugin());

const compiler = webpack(config)
const app = express()
app
.use(devMiddleware(compiler, {
  noInfo: true,
  writeToDisk: true,
  publicPath: config.output.publicPath
}))
.use(hotMiddleware(compiler, {
  // log: console.log,
}))
.listen(8080, () => {
  console.log('Example app listening on port 8080!\n')
})

