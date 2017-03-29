const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  registerDate: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    default: require('uuid').v4,
    unique: true,
    required: true
  },
  phone: {
    type: String
  },
  deviceToken: {
    type: String
  }
});
