const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_name: { type: String, required: true },
  description: String,
  image:  {
  filename: String,
  path: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now }
}
});

module.exports = mongoose.model('Event', eventSchema);
