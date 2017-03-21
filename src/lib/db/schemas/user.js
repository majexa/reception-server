const mongoose = require('mongoose');
const uuid = require('uuid');

module.exports = mongoose.Schema({
  registerDate: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: uuid.v4
  },
  phone: {
    type: String
  },
  deviceToken: {
    type: String
  }
});
