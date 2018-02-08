const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')

const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const DataLoader = require('dataloader')

const User = require('./models/User')

const schema = require('./schema')

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(async (req, res, next) => {
  const token = req.headers["authorization"] || req.query.token
  if (!token) {
    return next()
  }

  try {
    req.user = await User.getByToken(token)
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
  endpointURL: '/graphql'
}))


app.listen(3000)
