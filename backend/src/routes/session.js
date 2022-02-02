const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const router = express.Router()

router.post('/authenticate', async (req, res) => {
  const username = req.body.params.username
  const password = req.body.params.password

  if (username && password) {
    const user = await User.findOne({ where: { email: username.toLowerCase() } })
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id, email: user.email }, config.secret, {
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

module.exports = router
