const { DataTypes,
  Op
} = require('sequelize')
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
  abc: {
    type: DataTypes.TEXT,
    ...validateString(true, null)
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
  },
  status: {
    type: DataTypes.ENUM('new', 'blocked', 'moderated'),
    allowNull: false,
    defaultValue: 'new',
    validate: {
      ...validateString(true, 255)
    }
  }
}, {
  sequelize,
  scopes: {
    moderated: {
      where: {
        status: 'moderated'
      }
    },
    createdBy(userId) {
      return {
        where: {
          createdById: userId
        }
      }
    },
    forUser(userId) {
      return {
        where: {
          [Op.or]: [
            {createdById: userId},
            {status: 'moderated'}
          ]
        }
      }
    }
  }
})

User.files = User.hasMany(File, {
  as: 'files',
  foreignKey: {
    name: 'createdById',
    allowNull: false
  }
})
File.createdBy = File.belongsTo(User, {
  as: 'createdBy'
})

File.serializerScheme = {
  include: ['@all', 'url', 'createdBy'],
  exclude: ['createdById'],
  assoc: {
    createdBy: {
      include: ['id', 'name']
    }
  }
}

module.exports = File
