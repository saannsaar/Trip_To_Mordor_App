const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const {userExtractor } = require('../utils/middleware')
const logger = require('../utils/logger')



userRouter.get('/:id', userExtractor, async (request, response) => {

  const findUser = await User.findById(request.params.id)
  if ( findUser.id !== request.user.id)  {

    response.status(401).json({error: "You are not authorized to view this page"})
    logger.error(`GETERROR, USER ${request.user.name}, ERRORMESSAGE: Not authorized to view this parents information ${request.params.id}`)

  }  

    try {
      const spesific_user = await User.findById(request.params.id)
      if (spesific_user) {
        response.json(spesific_user)
      }
    } catch (error) {
      logger.error(`GETERROR, USER ${request.user.name}, ERRORMESSAGE: ${error}`)
      response.status(404).end()
    }
  })



    userRouter.post('/', async (request, response) => {


      console.log("user router", request.body)
      console.log(request.body)
      const {name, username, refresh_token, stravaid, password} = request.body

      const saltRounds = 10 
      const passwordHash = await bcrypt.hash(password, saltRounds)
  
      const user = new User({
          name,
          username,
          refresh_token,
          passwordHash,
          stravaid
      })

      console.log(user)
  
      try {
        const saved_user = await user.save()
        console.log(user)
        response.status(201).json(saved_user)
      } catch (error) {
        console.log(error)
        response.status(400).json(error)
        logger.error(`GETERROR, USER ${user.name}, ERRORMESSAGE: ${error}`)
      }
    
})

  module.exports = userRouter