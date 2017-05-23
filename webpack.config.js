var path = require('path')
var nodeExternals = require('webpack-node-externals')

var configExternals = function (context, request, callback) {
  if (/config.json$/.test(request)) {
    return callback(null, 'require("./config")')
  }
  callback()
}

module.exports = {
  entry: {
    index: './src/index.js'
  },
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  context: __dirname,
  node: {
    __dirname: false
  },
  externals: [
    nodeExternals(),
    configExternals
  ],
  devtool: 'sourcemap',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
