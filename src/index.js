import { startScheduler } from './scheduler/readingsScheduler'
import { startServer } from './api/apiServer'
import config from './config.json'

console.log(`Device "${config.devices[0].name}", port: ${config.devices[0].port}`)
startScheduler()
startServer()

