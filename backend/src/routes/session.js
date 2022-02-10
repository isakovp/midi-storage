const User = require('../models/user')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { ValidationError } = require('sequelize')
const router = express.Router()

router.post('/authenticate', async (req, res) => {
  const username = req.body.params.username
  const password = req.body.params.password

  if (username && password) {
    const user = await User.findOne({ where: { email: username.toLowerCase() } })
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toLocaleString()
      }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      })
      return res
        .status(200)
        .send({
          auth: true,
          token
        })
    }
  }
  return res
    .status(401)
    .send({
      auth: false,
      token: null
    })
})

router.post('/signUp', async (req, res) => {
  const email = req.body.params.username
  const name = req.body.params.name
  const password = req.body.params.password

  try {
    const newUser = await User.create({
      email,
      name,
      password: password ? bcrypt.hashSync(password) : ''
    })
    const token = jwt.sign({
      id: newUser.id,
      email: newUser.email
    }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    })
    return res
      .status(200)
      .send({
        auth: true,
        token
      })
  } catch (ex) {
    if (ex instanceof ValidationError) {
      const response = {}
      ex.errors.forEach((error) => {
        response[error.path] = ex.get(error.path).map(m => m.message)
      })
      return res
        .status(422)
        .send(response)
    } else {
      throw ex
    }
  }
})

module.exports = router
