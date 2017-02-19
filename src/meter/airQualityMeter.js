import config from '../config.json'

export const getReadings = () => {
  return {
    sds011: {
      PM25: 2.5,
      PM10: 10
    }
  }
}

export const collectData = () => {
  console.log(`Collecting data from ${config.devices[0].name}", port: ${config.devices[0].port}`)
}
