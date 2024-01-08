const activityRouter = require('express').Router()
const bcrypt = require('bcrypt')
const Activity = require('../models/Activity')
const User = require('../models/User')
const {userExtractor } = require('../utils/middleware')
const logger = require('../utils/logger')



activityRouter.get('/:id', userExtractor, async (request, response) => {

  const findUser = await User.findById(request.params.id)
  if ( findUser.id !== request.user.id)  {

    response.status(401).json({error: "You are not authorized to view this page"})
    logger.error(`GETERROR, USER ${request.user.name}, ERRORMESSAGE: Not authorized to view this parents information ${request.params.id}`)

  }  

    try {
      const findactivities = await Activity.find({user: findUser._id})
      if (findactivities) {
        response.json(findactivities)
      }
    } catch (error) {
      logger.error(`GETERROR, ERRORMESSAGE: ${error}`)
      response.status(404).end()
    }
  })



activityRouter.post('/', async (request, response) => {

    const findUser = await User.findById(request.body.user)
    console.log(findUser)
      const activity = new Activity({
          type: request.body.type,
          start_date: request.body.start_date,
          elapsed_time: request.body.elapsed_time,
          avg_hr: request.body.avg_hr ? request.body.avg_hr : null,
          avg_speed: request.body.avg_speed ? request.body.avg_speed : null,
          distance: request.body.distance ? request.body.distance : null,
          user: findUser._id,
      })
  
      try {
        const saved_activity = await activity.save()
        response.status(201).json(saved_activity)
      } catch (error) {
        response.status(400).json(error)
        logger.error(`GETERROR, ERRORMESSAGE: ${error}`)
      }
    
})

  module.exports = activityRouter