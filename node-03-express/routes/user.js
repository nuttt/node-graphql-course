const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.sendStatus(400)
  }

  const user = await User.create(username, password)
  return res.sendStatus(201)
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.sendStatus(400)
  }

  const token = await User.authenticate(username, password)
  if (!token) {
    res.sendStatus(401)
  }
  res.status(200).send(token)
})

module.exports = router
