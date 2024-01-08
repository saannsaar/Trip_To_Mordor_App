const mongoose = require('mongoose')

// you must install this library
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },  
  elapsed_time: {
    type: Number,
    required: true,
  },
  avg_hr: {
    type: Number,
  },
  avg_speed: {
    type: Number,
  },
  distance: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

schema.plugin(uniqueValidator)
schema.set('toJSON', {
  transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
  }
})

module.exports = mongoose.model('Activity', schema)