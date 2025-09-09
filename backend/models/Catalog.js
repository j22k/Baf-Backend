const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  description: String,
  image: {
  filename: String,
  path: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now }
}
});

module.exports = mongoose.model('Catalog', catalogSchema);
