import SerialPort from 'serialport'

import { delay } from '../../../utils/asyncHelpers'

import { SerialStart, SerialEnd, SendByte, CommandTerminator } from './sdsConsts'
import { WorkState, DutyCycle } from './commandTypes'
import { createResumeCommand, createPauseCommand } from './sdsCommand'

export class SdsSensor {

  constructor (deviceName, portName) {
    this._port = new SerialPort(portName, { baudRate: 9600,
      parity: 'none',
      autoOpen: false,
      dataBits: 8,
      stopBits: 1 })

    this._isRunning = false
    this._deviceName = deviceName
  }

  isRunning () { return this._isRunning }
  getDeviceName () { return this._deviceName }

  start (callback) {
    const port = this._port
    if (port.isOpen()) {
      return
    }
    const that = this
    port.open(async (err) => {
      if (err) {
        throw new Error(err)
      }
      console.log('Port open!!!')
      await delay(500)
      that.resume()
      port.on('data', data => {
        that.getReading(data, callback)
        that.handleCommandResponse()
      })
    })
  }

  async stopAsync () {
    await this.pauseAsync()
    if (this._port.isOpen()) {
      this._port.close()
    }
  }

  resume () {
    if (!this._isRunning) {
      console.log('Resume!!!!!!!!!')
      this.sendCommand(createResumeCommand())
      this._isRunning = true
    }
  }

  async pauseAsync (callback) {
    const that = this
    return new Promise(async (resolve) => {
      if (this._isRunning) {
        that.sendCommand(createPauseCommand())
        console.log('Paused!!!!!!!!!')
        await delay(500)
        that._isRunning = false
      }
      resolve()
    })
  }

  handleCommandResponse () {
    if (!this._isRunning) {
      this._isRunning = true
    }
  }

  getReading (data, readingCallback) {
    if (this._isRunning && this.checkReadingCrc(data)) {
      const reading = {
        PM25: (data[2] | (data[3] << 8)) / 10,
        PM10: (data[4] | (data[5] << 8)) / 10
      }
      console.log(`CollectedData - PM2.5: ${reading.PM25} , PM10: ${reading.PM10}`)
      readingCallback(reading)
    }
  }

  checkReadingCrc (data) {
    const crc = (data[2] + data[3] + data[4] + data[5] + data[6] + data[7]) % 256
    const checkSum = data[8]
    return crc === checkSum
  }

  sendCommand (command) {
    const bufferArray = []
    bufferArray.push(SerialStart)
    bufferArray.push(SendByte)
    bufferArray.push(command.commandType)
    const commandDefaultData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    commandDefaultData.map((defaultValue, index) => {
      if (command.data.length > index) {
        bufferArray.push(command.data[index])
      } else {
        bufferArray.push(defaultValue)
      }
    })

    bufferArray.push(CommandTerminator)
    bufferArray.push(CommandTerminator)
    bufferArray.push(this.generateCrc(bufferArray))
    bufferArray.push(SerialEnd)

    const buffer = Buffer.from(bufferArray)
    this._port.write(buffer, (err, asdsad) => {
      if (err) {
        throw new Error(err)
      }
    })
  }

  generateCrc (commandData) {
    this.validateByte(commandData, 0, [SerialStart])
    this.validateByte(commandData, 1, [SendByte])
    this.validateByte(commandData, 2, [WorkState, DutyCycle])

    const checksum = commandData.reduce((prev, current, index) => {
      if (index > 1) {
        return prev + current
      } else {
        return 0
      }
    }, 0)
    return checksum % 256
  }

  validateByte (data, index, possibleValues) {
    if (possibleValues.indexOf(data[index]) === -1) {
      throw new Error(`Cannot generate command crc - ${index} element with value ${data[index]} cannot be found in possible values ${possibleValues.map(p => p.toString())}`)
    }
  }
}
