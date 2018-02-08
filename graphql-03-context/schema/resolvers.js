const Post = require('../models/Post')
const User = require('../models/User')

module.exports = {
  Query: {
    posts: () => {
      return Post.list()
    }
  },
  Post: {
    user: (post, args, context) => {
      return context.loaders.userLoader.load(post.userId)
    }
  },
  User: {
    posts: (user) => {
      return Post.listByUser(user.id)
    }
  },
  Mutation: {
    createPost: (obj, args, context) => {
      if (!context.user) {
        throw new Error('401')
      }
      return Post.create(context.user.id, args.data.title, args.data.content)
    },
    login: (obj, args) => {
      return User.authenticate(args.username, args.password)
    }
  }
}
