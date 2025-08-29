const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },

});

module.exports = mongoose.model('users', teamSchema);
