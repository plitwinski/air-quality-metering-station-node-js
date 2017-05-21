jest.mock('../../../utils/asyncHelpers', () => ({
  delay: (timeout) => Promise.resolve()
}))

jest.mock('../../../utils/consoleLogger', () => ({
  log: (msg) => {}
}))

jest.mock('serialport', () => require('../../../../test/utils/fakeSerialPort'))

import { SdsSensor } from './sdsSensor'

const sensorName = 'test'
const portName = 'portTest'

describe(`When '${SdsSensor.name}'`, () => {
  describe('is created', () => {
    let sensor
    beforeAll(() => {
      sensor = new SdsSensor(sensorName, portName)
    })

    it('then sensor name is correct', () => {
      expect(sensor.getDeviceName()).toBe(sensorName)
    })

    it('then sensor port name is correct', () => {
      expect(sensor._port.portName).toBe(portName)
    })

    it('then sensor port configuration is correct', () => {
      const portConfigs = sensor._port.params
      expect(portConfigs.baudRate).toBe(9600)
      expect(portConfigs.parity).toBe('none')
      expect(portConfigs.autoOpen).toBe(false)
      expect(portConfigs.dataBits).toBe(8)
      expect(portConfigs.stopBits).toBe(1)
    })
  })

  describe('starts receiving data', () => {
    let sensor
    let readings
    beforeAll((done) => {
      sensor = new SdsSensor(sensorName, portName)
      sensor.start((r) => {
        readings = r
        done()
      })
    })

    it('then sensor is running', () => {
      expect(sensor.isRunning()).toBe(true)
    })

    it('then correct results are returned via callback', () => {
      expect(readings.PM25).toBe(26.4)
      expect(readings.PM10).toBe(0)
    })
  })

  describe('stops receiving data', () => {
    let sensor
    beforeAll((done) => {
      sensor = new SdsSensor('test', 'portTest')
      sensor.start(async () => {
        await sensor.stopAsync()
        done()
      })
    })

    it('then sensor is not running', () => {
      expect(sensor.isRunning()).toBe(false)
    })

    it('then port has been closed', () => {
      expect(sensor._port.closeMock).toHaveBeenCalled()
    })
  })
})
