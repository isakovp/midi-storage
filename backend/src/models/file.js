const { DataTypes } = require('sequelize')
const BaseModel = require('./baseModel')
const config = require('../config/config')
const sequelize = require('./db')
const User = require('./user')
const { validateString } = require('./validator')

class File extends BaseModel {
  url () {
    return [config.serverUrl, config.uploadDir, this.filename].join('')
  }
}

File.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      ...validateString(true, 255)
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      ...validateString(true, null)
    }
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  favorites: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      ...validateString(true, 255)
    }
  }
}, {
  sequelize
})

User.files = User.hasMany(File, {
  as: 'files',
  constraints: false,
  foreignKey: {
    name: 'createdById',
    allowNull: false
  }
})
File.belongsTo(User, {
  as: 'createdBy',
  constraints: false
})

module.exports = File
module.exports.serializerScheme = {
  include: ['@all', 'url', 'createdBy'],
  exclude: ['createdById'],
  assoc: {
    createdBy: {
      include: ['id', 'name']
    }
  }
}
