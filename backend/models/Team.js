const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Designation: String,
  image: String,
});

module.exports = mongoose.model('team', teamSchema);
