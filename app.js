const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

const config = require('./utils/config')
const {
  requestLogger,
  unknownEndPoint,
  errorHandler
} = require('./utils/middleware')

const url = config.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.error('error connecting to MongoDB:', error.message)
  })

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
app.use(requestLogger)

const peopleRouter = require('./controllers/people')
app.use('/api/persons', peopleRouter)

// Error handling
app.use(unknownEndPoint)
app.use(errorHandler)
// End of error handling

module.exports = app
