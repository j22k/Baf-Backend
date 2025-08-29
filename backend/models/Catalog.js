const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  description: String,
  image: String,
});

module.exports = mongoose.model('catalog', catalogSchema);
