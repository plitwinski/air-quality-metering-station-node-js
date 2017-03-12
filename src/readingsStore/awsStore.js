import path from 'path'
import awsIoT from 'aws-iot-device-sdk'
import config from '../config.json'

import eventAggregator from '../events/eventAggregator'
import { PM_READING_STARTED, PM_READING_FINISHED } from '../events/eventConstants'

const appRoot = path.dirname(require.main.filename)
const topicName = 'pm_reading'
const device = awsIoT.device({
  keyPath: path.resolve(appRoot, config.awsIoT.keyPath),
  certPath: path.resolve(appRoot, config.awsIoT.certPath),
  caPath: path.resolve(appRoot, config.awsIoT.caPath),
  clientId: `air-quality-metering-station_${config.awsIoT.clientId}`,
  region: config.awsIoT.region
})

let isConnected = false

device.on('connect', () => {
  console.log('Device connected to AWS IoT')
  isConnected = true
})

device.on('error', (error) => console.log('error', error))
device.on('close', () => console.log('close'))
device.on('reconnect', () => console.log('reconnect'))
device.on('offline', () => console.log('offline'))
device.on('message', (topic, payload) => console.log('message', topic, payload.toString()))
const readingStarted = () => console.log('Reading started')

const readingFinished = (readings) => {
  console.log('results arrived: ', JSON.stringify(readings))
  console.log('is device connected to AWS IoT: ', isConnected)
  if (isConnected) {
    readings.forEach((reading) => {
      const data = {
        deviceType: reading.deviceName,
        'PM2.5': reading.PM25,
        PM10: reading.PM10,
        location: config.awsIoT.location
      }

      device.publish(topicName, JSON.stringify(data), {qos: 0, retain: false}, (err) => {
        if (err) {
          console.log('ERROR!!!!', err)
        }
      })
    })
  }
}

export const startListening = () => {
  eventAggregator.on(PM_READING_STARTED, readingStarted)
  eventAggregator.on(PM_READING_FINISHED, readingFinished)
}

export const stopListening = () => {
  console.log('Unregistering AWS IoT PM listening')
  eventAggregator.removeListener(PM_READING_STARTED, readingStarted)
  eventAggregator.removeListener(PM_READING_FINISHED, readingFinished)
}
