const db = require('../db')

const Post = {
  get: async (id) => {
    const posts = await db('posts').where({ id })
    return posts[0]
  },

  list: async () => {
    return db('posts')
  },

  listByUser: async (userId) => {
    return db('posts').where({ userId })
  },

  create: async (userId, title, content) => {
    const ids = await db('posts').insert({ userId, title, content })
    return Post.get(ids[0])
  }
}

module.exports = Post
