const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  servicename: { type: String, required: true },
  description: String,
  image: String,
});

module.exports = mongoose.model('services', serviceSchema);
