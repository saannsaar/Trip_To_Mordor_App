const mongoose = require('mongoose')

// you must install this library
//const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true
  }, 
  stravaid: {
    type: String,
    required: true
  },
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  }],
  passwordHash: String,
})

// schema.plugin(uniqueValidator)
schema.set('toJSON', {
  transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', schema)