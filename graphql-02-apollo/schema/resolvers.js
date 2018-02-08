const Post = require('../models/Post')
const User = require('../models/User')

const DataLoader = require('dataloader')

const UserLoader = new DataLoader(async (keys) => {
  return Promise.all(keys.map(User.get))
})

module.exports = {
  Query: {
    posts: () => {
      return Post.list()
    }
  },
  Post: {
    user: (post) => {
      return UserLoader.load(post.userId)
    }
  },
  User: {
    posts: (user) => {
      return Post.listByUser(user.id)
    }
  },
  Mutation: {
    createPost: (obj, args) => {
      return Post.create(1, args.data.title, args.data.content)
    }
  }
}
