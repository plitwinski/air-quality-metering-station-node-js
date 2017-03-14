var webpack = require('webpack')
var webpackConfig = require('../webpack.config')
var cmd = require('node-cmd')
var fs = require('fs')

var buildType = process.argv.length > 2 ? process.argv[2] : null

var deleteFolderRecursively = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursively(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

console.log('> Removing "build" directory')
deleteFolderRecursively('build')
console.log('> "build" directory removed')

webpack(webpackConfig, function (err) {
  if (err) {
    throw Error(err)
  }
  console.log('> Webpack finished')
  console.log('> Restoring packages')
  fs.createReadStream('package.json').pipe(fs.createWriteStream('build/package.json'))
  if (buildType === '--arm') {
    fs.createReadStream('linux_configs/config.json').pipe(fs.createWriteStream('build/config.json'))
  } else {
    fs.createReadStream('src/config.json').pipe(fs.createWriteStream('build/config.json'))
  }
  cmd.get('cd build && npm install --production', function (data, err) {
    if (err) {
      throw Error(err)
    }
    console.log(data)
    fs.unlinkSync('build/package.json')

    console.log('> Copying certificates')
    cmd.get('mkdir build\\certificates && xcopy /S /Y certificates build\\certificates', function (data, err) {
      if (err) {
        throw Error(err)
      }
      console.log(data)

      if (buildType === '--arm') {
        console.log('> Copying linux ARM copiled natives')
        deleteFolderRecursively('build/node_modules/serialport/build/Release')
        cmd.get('mkdir build\\node_modules\\serialport\\build\\Release && xcopy /S /Y dependencies\\linux\\arm\\serialport build\\node_modules\\serialport\\build\\Release', function (data, err) {
          if (err) {
            throw Error(err)
          }
          console.log(data)
          console.log('> Completed')
        })
      } else {
        console.log('> Completed')
      }
    })
  })
})

