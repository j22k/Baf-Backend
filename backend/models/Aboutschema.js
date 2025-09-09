const mongoose = require('mongoose');


const aboutSchema = new mongoose.Schema({
  description1: String,
  description2: String,
});



module.exports = mongoose.model('About', aboutSchema);
