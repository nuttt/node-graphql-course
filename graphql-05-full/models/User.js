const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const db = require('../db')
const _ = require('lodash')

const SHA256_SECRET = 'QWERTY'
const createSHA256Hex = (data) => {
  return crypto.createHmac('sha256', SHA256_SECRET)
               .update(data)
               .digest('hex')
}

const User = {
  get: async (id) => {
    console.log(`user: get ${id}`)
    const users = await db('users').where({ id })
    if (!users[0]) {
      return undefined
    }
    return _.omit(users[0], 'password')
  },

  create: async (username, password) => {
    const ids = await db('users').insert({
      username,
      password: createSHA256Hex(password)
    })

    return User.get(ids[0])
  },

  authenticate: async (username, password) => {
    const users = await db('users').where({ username })
    const user = users[0]

    if (!user) {
      return null
    }
    if (createSHA256Hex(password) !== user.password) {
      return null
    }

    return jwt.sign({ id: user.id }, SHA256_SECRET)
  },

  /**
   * @throws {TokenExpiredError}
   * @throws {JsonWebTokenError}
   */
  getByToken: async (token) => {
    let payload = null
    payload = jwt.verify(token, SHA256_SECRET)
    return User.get(payload.id)
  }
}

module.exports = User
