const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')

const userRoute = require('./routes/user')
const postRoute = require('./routes/post')

const User = require('./models/User')

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  if (!authHeader) {
    return next()
  }

  try {
    req.user = await User.getByToken(authHeader)
    next()
  } catch (e) {
    return res.sendStatus(401)
  }
})

app.use('/user', userRoute)
app.use('/post', postRoute)

app.listen(3000)
