import scheduler from 'node-schedule'

import { collectData } from '../meter/airQualityMeter'

let job = null

export const startScheduler = () => {
  if (job !== null) { return }
  console.log('Start collecting data')
  job = scheduler.scheduleJob('*/10 * * * * *', () => collectData())
  collectData()
}

export const stopScheduler = () => {
  if (job === null) { return }
  job.cancel()
}
