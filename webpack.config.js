var webpack = require('webpack')
var path = require('path')
var nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {
    airQualityMeteringStation: './src/index.js'
    // config: './src/config.js'
  },
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  externals: [
    nodeExternals(),
     { '../config.json': 'require("./config")' },
     { './config.json': 'require("./config")' }
  ],
  devtool: 'sourcemap'
}
