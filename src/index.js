import { startScheduler, stopScheduler } from './scheduler/readingsScheduler'
import { startServer, stopServer } from './api/apiServer'
import config from './config.json'

console.log(`Device "${config.devices[0].name}", port: ${config.devices[0].port}`)
startScheduler()
startServer()
console.log('Press any key to stop')

process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.on('data', () => {
  console.log('Stopping web server')
  stopServer()
  console.log('Web server stopped')
  console.log('Stopping scheduler')
  stopScheduler()
  console.log('Scheduler stopped')
  process.exit()
})
