jest.mock('../../../utils/asyncHelpers', () => ({
  delay: (timeout) => Promise.resolve()
}))

jest.mock('serialport', () => require('../../../../test/utils/fakeSerialPort'))

import { SdsSensor } from './sdsSensor'

const sensorName = 'test'
const portName = 'portTest'

describe(`When '${SdsSensor.name}'`, () => {
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

    it('sensor name is correct', () => {
      expect(sensor.getDeviceName()).toBe(sensorName)
    })

    it('sensor port name is correct', () => {
      expect(sensor._port.portName).toBe(portName)
    })

    it('sensor is running', () => {
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

    it('sensor is not running', () => {
      expect(sensor.isRunning()).toBe(false)
    })

    it('then port has been closed', () => {
      expect(sensor._port.closeMock).toHaveBeenCalled()
    })
  })
})
