const fs = require('fs')
const midiManager = require('midi-file')

const path = require('path')
const config = require('./src/config/config')
global.appRoot = path.resolve(__dirname)

const app = require('./src/server')

const input = fs.readFileSync('./uploads/file-1643760329786-268197286.mid')
const parsed = midiManager.parseMidi(input)
console.log(parsed)

app.listen(config.port, () =>
  console.log('Server listens')
)
