const { DataTypes } = require('sequelize')
const BaseModel = require('./baseModel')
const sequelize = require('./db')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { validateString } = require('./validator')

class User extends BaseModel {
  static verifyToken (req, res, next) {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    if (!token) {
      return res.status(403).send({
        auth: false,
        message: 'No token provided.'
      })
    }

    jwt.verify(token, config.secret, {}, async (err, decoded) => {
      if (err) {
        return res.status(403).send({
          auth: false,
          message: 'Invalid token.'
        })
      }

      const user = await User.findByPk(decoded.id)
      if (!user || user.email !== decoded.email || user.createdAt.toLocaleString() !== decoded.createdAt) {
        return res.status(403).send({
          auth: false,
          message: 'Invalid token.'
        })
      }
      req.user = user
      next()
    })
  }
}

User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: global.i18n.__('errors.validation.email_uniq')
    },
    validate: {
      ...validateString(true, 255),
      isEmail: {
        msg: global.i18n.__('errors.validation.field_email')
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      ...validateString(true, 255)
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      ...validateString(true, 255)
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'moderator'),
    allowNull: false,
    defaultValue: 'user',
    validate: {
      ...validateString(true, 255)
    }
  }

}, {
  sequelize,
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
})

module.exports = User
module.exports.serializerScheme = {
  include: ['@all'],
  exclude: ['password']
}
