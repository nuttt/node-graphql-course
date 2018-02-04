const crypto = require('crypto')
const db = require('../db')

const SHA256_SECRET = 'QWERTY'
const createSHA256Hex = (data) => {
  return crypto.createHmac('sha256', SHA256_SECRET)
               .update(data)
               .digest('hex')
}

const User = {
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
    if (createSHA256Hex(password) === user.password) {
      return user
    }
    return null
  },

  get: async (id) => {
    const users = await db('users').where({ id })
    return users[0]
  }
}

module.exports = User
