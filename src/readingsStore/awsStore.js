import path from 'path'
import awsIoT from 'aws-iot-device-sdk'
import uuid from 'node-uuid'
import config from '../config.json'

import eventAggregator from '../events/eventAggregator'
import { PM_READING_STARTED, PM_READING_FINISHED } from '../events/eventConstants'

const appRoot = './'
const topicName = config.awsIoT.topicName

const device = awsIoT.device({
  keyPath: path.resolve(appRoot, config.awsIoT.keyPath),
  certPath: path.resolve(appRoot, config.awsIoT.certPath),
  caPath: path.resolve(appRoot, config.awsIoT.caPath),
  clientId: `air-quality-metering-station_${config.awsIoT.clientId}`,
  region: config.awsIoT.region
})

let isConnected = false

device.on('connect', () => {
  console.log(`${(new Date()).toUTCString()} Device connected to AWS IoT`)
  isConnected = true
})

device.on('error', (error) => console.log('error', error))

const readingStarted = () => console.log('Reading started')

const readingFinished = (readings) => {
  if (isConnected) {
    readings.forEach((reading) => {
      const data = {
        deviceType: reading.deviceName,
        'PM2.5': reading.PM25,
        PM10: reading.PM10,
        location: config.awsIoT.location,
        localTime: new Date(),
        clientId: config.awsIoT.clientId
      }
      device.publish(topicName, JSON.stringify(data))
    })
  } else {
    console.log(`${(new Date()).toUTCString()} Could not send data to IoT - no connection`)
  }
}

export const startListening = () => {
  eventAggregator.on(PM_READING_STARTED, readingStarted)
  eventAggregator.on(PM_READING_FINISHED, readingFinished)
}

export const stopListening = async () => {
  console.log(`${(new Date()).toUTCString()} Unregistering AWS IoT PM listening`)
  eventAggregator.removeListener(PM_READING_STARTED, readingStarted)
  eventAggregator.removeListener(PM_READING_FINISHED, readingFinished)
  await device.end(true)
}
