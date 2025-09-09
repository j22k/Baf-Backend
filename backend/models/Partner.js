const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: {
  filename: String,
  path: String,
}
});

module.exports = mongoose.model('Partner', partnerSchema);
