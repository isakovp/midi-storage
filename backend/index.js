const path = require('path')
require('dotenv').config()
// eslint-disable-next-line no-undef
global.appRoot = path.resolve(__dirname)
const config = require('./src/config/config')
const app = require('./src/server')

app.listen(config.port, () =>
  console.log('Server listens')
)
