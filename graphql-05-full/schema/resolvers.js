const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')

const pubsub = require('../pubsub')

module.exports = {
  Query: {
    posts: () => {
      return Post.list()
    },
    post: (obj, args) => {
      return Post.get(args.id)
    }
  },
  Post: {
    user: (post, args, context) => {
      if (post.user) {
        console.log(context)
        return post.user
      }
      return context.loaders.userLoader.load(post.userId)
    },
    comments: (post) => {
      return Comment.listByPost(post.id)
    }
  },
  User: {
    posts: (user) => {
      return Post.listByUser(user.id)
    }
  },
  Comment: {
    user: (comment, args, context) => {
      return context.loaders.userLoader.load(comment.userId)
    }
  },
  Mutation: {
    createPost: async (obj, args, context) => {
      if (!context.user) {
        throw new Error('401')
      }
      const post = await Post.create(context.user.id, args.data.title,
      args.data.content)
      post.user = context.user
      pubsub.publish('postCreated', post)
      return post
    },
    createComment: async (obj, args, context) => {
      if (!context.user) {
        throw new Error('401')
      }
      const { data } = args
      const { postId, content } = data
      const comment = await Comment.create(context.user.id, postId, content)
      comment.user = context.user
      pubsub.publish('commentCreated', comment)
      return comment
    },
    
    login: (obj, args) => {
      return User.authenticate(args.username, args.password)
    },
    register: (obj, args) => {
      return User.create(args.username, args.password)
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
