import express from 'express'
import { airQualityMeter } from '../meter/airQualityMeter'
import config from '../config.json'

const app = express()
let server = null

app.get('/v1/readings', (reqest, response) => {
  const readings = airQualityMeter.getReadings()
  response.end(JSON.stringify(readings))
})

export const startServer = () => {
  if (server !== null) { return }

  server = app.listen(config.webServer.port, () => {
    console.log(`Example app listening at port ${server.address().port}`)
  })
}

export const stopServer = () => {
  if (server === null) { return }
  server.close()
}
