var webpack = require('webpack')
var webpackConfig = require('../webpack.config')
var cmd = require('node-cmd')
var fs = require('fs')

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

console.log('Removing "build" directory')
deleteFolderRecursive('build')
console.log('"build" directory removed')

webpack(webpackConfig, function (err) {
  if (err) {
    throw Error(err)
  }
  console.log('> Webpack finished')
  fs.createReadStream('package.json').pipe(fs.createWriteStream('build/package.json'))
  fs.createReadStream('src/config.json').pipe(fs.createWriteStream('build/config.json'))
  cmd.get('cd build && npm install --production', function (data, err) {
    if (err) {
      throw Error(err)
    }
    console.log(data)
    fs.unlinkSync('build/package.json')
    console.log('> Completed')
  })
})

