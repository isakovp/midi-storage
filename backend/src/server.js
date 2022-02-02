const express = require('express')
const cors = require('cors')
const config = require('./config/config')
const userRoutes = require('./routes/users')
const sessionRoutes = require('./routes/session')
const filesRoutes = require('./routes/files')

const app = express()

const corsOpts = {
  origin: config.whitelistDomains,
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],
  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ]
}

app.use(cors(corsOpts))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(global.appRoot + '/uploads'))
app.use('/api', sessionRoutes)
app.use('/api/files', filesRoutes)
app.use('/api/users', userRoutes)

app.route('*').get((req, res) => {
  return res
    .status(404)
    .send(null)
})

app.use((err, req, res, next) => {
  return res
    .status(500)
    .send({ error: err.toString(), status: 500 })
})

module.exports = app
