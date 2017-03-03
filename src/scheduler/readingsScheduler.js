import scheduler from 'node-schedule'

import { airQualityMeter } from '../meter/airQualityMeter'

let job = null

export const startScheduler = () => {
  if (job !== null) { return }
  console.log('Start collecting data')
  job = scheduler.scheduleJob('*/10 * * * *', () => airQualityMeter.collectReadingsAsync())
  airQualityMeter.collectReadingsAsync()
}

export const stopScheduler = () => {
  if (job === null) { return }
  job.cancel()
}
