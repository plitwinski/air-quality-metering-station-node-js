var path = require('path')
var webpack = require('webpack')

var configExternals = function (context, request, callback) {
  if (/config.json$/.test(request)) {
    return callback(null, 'require("./config")')
  }
  callback()
}

var serialPortExternals = function (context, request, callback) {
  if (/serialport$/.test(request) === true) {
    return callback(null, 'commonjs ' + request)
  }
  callback()
}

module.exports = function (isOmega2p) {
  return {
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
      configExternals,
      serialPortExternals
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
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          OMEGA2P: JSON.stringify(isOmega2p)
        }
      })
    ]
  }
}
