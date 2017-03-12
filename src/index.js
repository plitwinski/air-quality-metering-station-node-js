import { startScheduler, stopScheduler } from './scheduler/readingsScheduler'
import { startServer, stopServer } from './api/apiServer'
import config from './config.json'
import { startListening, stopListening } from './readingsStore/awsStore'


console.log(`Device "${config.devices[0].name}", port: ${config.devices[0].port}`)
startListening()
startScheduler()
startServer()
console.log('Press any key to stop')



const stopServices = () => {
  stopListening()
  console.log('Stopping web server')
  stopServer()
  console.log('Web server stopped')
  console.log('Stopping scheduler')
  stopScheduler()
  console.log('Scheduler stopped')
  process.exit()
}

process.stdin.on('data', () => {
  stopServices()
})

