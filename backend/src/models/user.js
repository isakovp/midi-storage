const { DataTypes, Model } = require('sequelize')
const sequelize = require('./db')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

class User extends Model {
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
      if (!user || user.email !== decoded.email) {
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
    unique: true,
    validate: {
      isEmail: {
        msg: 'Must be email address'
      },
      notEmpty: true,
      len: [0, 100]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [0, 100]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
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
