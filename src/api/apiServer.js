import express from 'express'
import { getReadings } from '../meter/airQualityMeter'

const app = express()
let server = null

app.get('/v1/readings', (reqest, response) => {
  const readings = getReadings()
  response.end(JSON.stringify(readings))
})

export const startServer = () => {
  if (server !== null) { return }

  server = app.listen(8080, () => {
    console.log(`Example app listening at http://${server.address().address}:${server.address().port}`)
  })
}

export const stopServer = () => {
  if (server === null) { return }
  server.close()
}
