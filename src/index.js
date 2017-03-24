import { delay } from './utils/asyncHelpers'
import { startScheduler, stopScheduler } from './scheduler/readingsScheduler'
import { startServer, stopServer } from './api/apiServer'
import config from './config.json'
import { startListening, stopListening } from './readingsStore/awsStore'

console.log(`${(new Date()).toUTCString()} Device "${config.devices[0].name}", port: ${config.devices[0].port}`)
startListening()
startScheduler()
startServer()
console.log('Press any key to stop')

const stopServices = async (exitCode = 0) => {
  await stopListening()
  console.log(`${(new Date()).toUTCString()} Stopping web server`)
  stopServer()
  console.log(`${(new Date()).toUTCString()} Web server stopped`)
  console.log(`${(new Date()).toUTCString()} Stopping scheduler`)
  stopScheduler()
  console.log(`${(new Date()).toUTCString()} Scheduler stopped`)
  await delay(500)
  process.exit(exitCode)
}

process.on('uncaughtException', async (err) => {
  console.log(`ERROR: ${(new Date()).toUTCString()} uncaughtException: `, err.message)
  console.log(err.stack)
  await stopServices(1)
})

process.on('unhandledRejection', async (reason, p) => {
  console.log(`${(new Date()).toUTCString()} ERROR: Promise rejected: ${reason}`)
  await stopServices(1)
})

process.stdin.on('data', async () => {
  await stopServices()
})

