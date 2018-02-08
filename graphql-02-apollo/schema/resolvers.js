const Post = require('../models/Post')
const User = require('../models/User')

module.exports = {
  Query: {
    posts: () => {
      console.log('hey!')
      return Post.list()
    }
  },
  Post: {
    user: (post) => {
      return User.get(post.userId)
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
