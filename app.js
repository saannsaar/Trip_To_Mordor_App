const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('express-async-errors')
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')

mongoose.set('strictQuery', false)
logger.info(`Connecting to db ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

  app.use(cors())
  app.use(express.static('build'))
  app.use(express.json())
  app.use(middleware.requestLogger)

  app.use('/api/login', loginRouter)
  app.use('/api/users', middleware.userExtractor, userRouter)
  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)


  
module.exports = app