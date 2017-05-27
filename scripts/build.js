var webpack = require('webpack')
var webpackConfig = require('../webpack.config')
var cmd = require('node-cmd')
var fs = require('fs')

var buildType = process.argv.length > 2 ? process.argv[2].replace('--', '') : null

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

var runCommand = function (command, callback) {
  cmd.get(command, function (data, err) {
    if (err) {
      throw Error(err)
    }
    console.log(data)
    callback()
  })
}

webpack(webpackConfig(buildType === 'omega2p'), function (err) {
  if (err) {
    throw Error(err)
  }
  console.log('> Webpack finished')
  console.log('> Restoring packages')

  if (buildType !== null) {
    fs.createReadStream('deployment_configs/' + buildType + '/config.json').pipe(fs.createWriteStream('build/config.json'))
  } else {
    fs.createReadStream('src/config.json').pipe(fs.createWriteStream('build/config.json'))
  }

  var installSerialPortCommand = 'npm install --production && mkdir build\\node_modules\\serialport && xcopy /S /Y node_modules\\serialport build\\node_modules\\serialport'

  if (buildType === 'omega2p') {
    installSerialPortCommand = 'mkdir build\\node_modules\\serialport && xcopy /S /Y dependencies\\omega2\\serialport build\\node_modules\\serialport'
  }

  if (buildType === 'pi') {
    installSerialPortCommand += ' && xcopy /S /Y dependencies\\pi\\serialport\\Release build\\node_modules\\serialport\\build\\Release'
  }

  console.log('> Installing serialport')
  runCommand(installSerialPortCommand, function () {
    console.log('> serialport installed')
    runCommand('mkdir build\\certificates && xcopy /S /Y certificates build\\certificates', function () {
      console.log('> Completed')
    })
  })
})

