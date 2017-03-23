import { Monitor } from 'forever-monitor'
import { resolve } from 'path'

const maxRestarts = 1000000

const indexPath = resolve(__dirname, 'index.js')
const appliance = new Monitor(indexPath, {
  max: maxRestarts,
  args: [],
  silent: false
})

appliance.on('exit', function () {
  console.log(`index.js has exited after ${maxRestarts} restarts`)
  appliance.restart()
})

appliance.start()
