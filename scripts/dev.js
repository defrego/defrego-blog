const express = require('express')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require("webpack-hot-middleware")
const { createProxyMiddleware } = require('http-proxy-middleware')
let config = require('../webpack.dev.js')

const app = express()
const compiler = webpack(config)

app.use('/data/', createProxyMiddleware({
  target: "http://localhost:3000/"
}))
app.use(devMiddleware(compiler, {
  noInfo: true,
  writeToDisk: false,
  publicPath: config.output.publicPath
}))
app.use(hotMiddleware(compiler, {
  // log: console.log,
}))
app.listen(8080, () => {
  console.log('Example app listening on port 8080!\n')
})

