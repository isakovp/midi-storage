const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/me', User.verifyToken, async (req, res) => {
  const user = req.user
  await user.reload()
  return res
    .status(200)
    .send(user.serialize())
})

module.exports = router
