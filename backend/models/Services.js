const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  servicename: { type: String, required: true },
  description: String,
  image:{
  filename: String,
  path: String,
}
});

module.exports = mongoose.model('services', serviceSchema);
