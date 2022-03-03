/* eslint-disable no-undef */
module.exports = {
  secret: 'supersecret',
  uploadDir: 'uploads/',
  serverUrl: 'http://localhost:3001/',
  port: 3001,
  whitelistDomains: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  databaseURL: process.env.DATABASE_URL
}
