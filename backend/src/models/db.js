const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('postgres://localhost:5432/midi-storage')
module.exports = sequelize
