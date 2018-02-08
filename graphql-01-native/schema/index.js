const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
  GraphQLInputObjectType
} = require('graphql')
const Post = require('../models/Post')

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLID  },
    title: { type: GraphQLString },
    content: { type: GraphQLString }
  }
})

const query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'hello'
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: () => Post.list()
    }
  }
})

const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString }
  }
})

const mutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createPost: {
      type: PostType,
      args: {
        data: { type: CreatePostInputType }
      },
      resolve: (obj, args) => {
        return Post.create(1, args.data.title, args.data.content)
      }
    }
  }
})

const schema = new GraphQLSchema({
  query,
  mutation
})

module.exports = schema
