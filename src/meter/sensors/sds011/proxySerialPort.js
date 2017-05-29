import SerialPort from 'serialport'

if (process.env.OMEGA2P) {
  var SerialPortOmega2 = require('serialport').SerialPort // it needs to be like this so all works on node 4.3 on Omega2
}

export default (process.env.OMEGA2P) ? SerialPortOmega2 : SerialPort
