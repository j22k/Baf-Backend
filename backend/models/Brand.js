const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo:  {
  filename: String,
  path: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now }
}
});

module.exports = mongoose.model('Brand', brandSchema);
