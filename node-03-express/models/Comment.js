const db = require('../db')

const Comment = {
  get: async (id) => {
    const comments = await db('comments').where({ id })
    return comments[0]
  },

  listByPost: async (postId) => {
    return db('comments').where({ postId })
  },

  create: async (userId, postId, content) => {
    const ids = await db('comments').insert({ userId, postId, content })
    return Comment.get(ids[0])
  }
}

module.exports = Comment
