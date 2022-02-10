const { Sequelize } = require('sequelize')
const { databaseURL } = require('../config/config')

const logger = (sql, info) => {
  console.groupCollapsed("SQL " + info.type)
  console.log(sql)
  console.groupEnd()
}

const sequelize = new Sequelize(databaseURL, {
  logQueryParameters: true,
  // eslint-disable-next-line no-undef
  logging: process.env.NODE_ENV === 'production' ? false : logger
})
module.exports = sequelize
