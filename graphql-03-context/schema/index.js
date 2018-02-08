
const fs = require('fs-extra')
const path = require('path')
const { makeExecutableSchema } = require('graphql-tools')


const typeDefs = fs.readFileSync(path.join(__dirname, './schema.graphql')).toString()
const resolvers = require('./resolvers')

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
})

