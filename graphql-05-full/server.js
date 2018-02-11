const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { execute, subscribe } = require('graphql')
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')

const DataLoader = require('dataloader')

const User = require('./models/User')

const schema = require('./schema')

app.use(morgan('dev'))
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(async (req, res, next) => {
  const token = req.headers["authorization"] || req.query.token
  console.log(req.query.token)
  if (!token) {
    return next()
  }

  try {
    req.user = await User.getByToken(token)
    console.log(req.user)
    next()
  } catch (e) {
    if (e.name === 'TokenExpiredError' || e.name === 'JsonWebTokenError') {
      return res.sendStatus(401)
    }
    next(e)
  }
})

app.use('/graphql', graphqlExpress((req, res) => ({
  schema,
  context: {
    user: req.user,
    loaders: {
      userLoader: new DataLoader(async (keys) => {
        return Promise.all(keys.map(User.get))
      })
    }
  }
})))

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:3001/subscriptions'
}))

const server = createServer(app)
server.listen(3001, () => {
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server,
    path: '/subscriptions'
  })
})
