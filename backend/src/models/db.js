const { Sequelize } = require('sequelize')
const { databaseURL } = require('../config/config')

const logger = (sql, info) => {
  console.groupCollapsed("SQL " + info.type)
  console.log(sql)
  console.groupEnd()
}

const sequelize = new Sequelize(databaseURL, {
  logQueryParameters: true,
  logging: logger,
  timezone: process.env.TZ
})
module.exports = sequelize
