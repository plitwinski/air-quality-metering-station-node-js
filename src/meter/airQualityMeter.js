
import config from '../config.json'
import { SdsSensor } from './sensors/sds011/sdsSensor'
import { delay } from '../utils/asyncHelpers'

import eventAggregator from '../events/eventAggregator'
import { PM_READING_STARTED, PM_READING_FINISHED } from '../events/eventConstants'

class AirQualityMeter {
  constructor () {
    this._isCollectingData = false
    this._isReadyToReceiveReadings = false
    this._sensors = config.devices.map(device => new SdsSensor(device.name, device.port))
    this._results = this._sensors.map(device => ({ name: device.getDeviceName(), PM25: -1, PM10: -1 }))
    this._collectedReadings = this._sensors.map(sensor => ({
      name: sensor.getDeviceName(),
      readings: []
    }))
  }

  getIsCollectingData () {
    return this._isCollectingData
  }

  getReadings () {
    return this._results
  }

  _getResults () {
    return this._collectedReadings.map(sensorReading => {
      const avgPM25 = Math.round(sensorReading.readings.map(p => p.PM25).reduce((a, b) => a + b, 0) / sensorReading.readings.length)
      const avgPM10 = Math.round(sensorReading.readings.map(p => p.PM10).reduce((a, b) => a + b, 0) / sensorReading.readings.length)
      return {
        deviceName: sensorReading.name,
        PM25: isNaN(avgPM25) ? -1 : avgPM25,
        PM10: isNaN(avgPM10) ? -1 : avgPM10
      }
    })
  }

  async collectReadingsAsync () {
    if (this._isCollectingData === true) { return }

    eventAggregator.emit(PM_READING_STARTED)
    const that = this
    this._isCollectingData = true
    this._collectedReadings.map(item => { item.readings = [] })
    this._sensors.map(sensor => sensor.start(reading => {
      if (that._isReadyToReceiveReadings) {
        const deviceReadings = that._collectedReadings.filter(item => item.name === sensor.getDeviceName())[0]
        deviceReadings.readings.push(reading)
      }
    }))
    await delay(60000)
    this._isReadyToReceiveReadings = true
    await delay(60000)
    this._isReadyToReceiveReadings = false
    this._sensors.map(async sensor => await sensor.stopAsync())
    this._results = this._getResults()
    this._isCollectingData = false
    eventAggregator.emit(PM_READING_FINISHED, this._results)
  }
}

export const airQualityMeter = new AirQualityMeter()

