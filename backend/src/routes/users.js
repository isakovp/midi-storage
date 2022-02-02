const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Serializer = require('sequelize-to-json')

router.get('/me', User.verifyToken, async (req, res) => {
  const user = req.user
  await user.reload()
  return res
    .status(200)
    .send(new Serializer(User, User.serializerScheme).serialize(user))
})

module.exports = router
