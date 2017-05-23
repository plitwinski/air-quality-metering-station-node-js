import http from 'http'
import { airQualityMeter } from '../meter/airQualityMeter'
import config from '../config.json'

const validateMethod = (request, response) => {
  if (request.method !== 'GET') {
    response.statusCode = 405
    response.end()
    return false
  } else {
    return true
  }
}

const validatePath = (request, response) => {
  if (request.url !== '/v1/readings') {
    response.statusCode = 404
    response.end()
    return false
  } else {
    return true
  }
}

const server = http.createServer()
server.on('request', (request, response) => {
  if (validateMethod(request, response) === true &&
      validatePath(request, response)) {
    const readings = airQualityMeter.getReadings()
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.write(JSON.stringify(readings))
    response.end()
  }
})

export const startServer = () => {
  server.listen(config.webServer.port)
}

export const stopServer = () => {
  if (server === null) { return }
  server.close()
}
