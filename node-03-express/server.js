const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')

const userRoute = require('./routes/user')

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/user', userRoute)

app.listen(3000)
