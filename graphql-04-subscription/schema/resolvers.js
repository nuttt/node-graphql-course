const Post = require('../models/Post')
const User = require('../models/User')

const pubsub = require('../pubsub')

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
    createPost: async (obj, args, context) => {
      if (!context.user) {
        throw new Error('401')
      }
      const post = await Post.create(context.user.id, args.data.title,
      args.data.content)
      pubsub.publish('postCreated', post)
      return post
    },
    login: (obj, args) => {
      return User.authenticate(args.username, args.password)
    }
  },
  Subscription: {
    postCreated: {
      subscribe: () => {
        return pubsub.asyncIterator('postCreated')
      },
      resolve: (post) => {
        return post
      }
    }
  }
}
