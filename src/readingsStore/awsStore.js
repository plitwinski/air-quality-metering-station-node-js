import eventAggregator from '../events/eventAggregator'
import { PM_READING_STARTED, PM_READING_FINISHED } from '../events/eventConstants'

const readingStarted = () => console.log('Reading started')

const readingFinished = (reading) => console.log('results: ', reading)

export const startListening = () => {
  eventAggregator.on(PM_READING_STARTED, readingStarted)
  eventAggregator.on(PM_READING_FINISHED, readingFinished)
}

export const stopListening = () => {
  console.log('Unregistering AWS IoT PM listening')
  eventAggregator.removeListener(PM_READING_STARTED, readingStarted)
  eventAggregator.removeListener(PM_READING_FINISHED, readingFinished)
}
