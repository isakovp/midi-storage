const {
  DataTypes,
  Model
} = require('sequelize')
const config = require('../config/config')
const sequelize = require('./db')

class File extends Model {
  url () {
    return [config.serverUrl, config.uploadDir, this.filename].join('')
  }
}

File.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [0, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [0, 1000]
    }
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    defaultValue: 0
  },
  favorites: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    defaultValue: 0
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [0, 100]
    }
  }

}, {
  sequelize
})

module.exports = File
module.exports.serializerScheme = {
  include: ['@all', 'url']
}
