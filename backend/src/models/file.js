const {
  DataTypes,
  Model
} = require('sequelize')
const config = require('../config/config')
const sequelize = require('./db')
const User = require('./user')
const { validateString } = require('./validator')

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

File.createdBy = File.belongsTo(User, {
  as: 'createdBy',
  foreignKey: 'createdById'
})
User.files = User.hasMany(File, {
  as: 'files',
  foreignKey: 'createdById'
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
