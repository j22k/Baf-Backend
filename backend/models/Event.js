const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_name: { type: String, required: true },
  description: String,
  image: String,
});

module.exports = mongoose.model('Event', eventSchema);
