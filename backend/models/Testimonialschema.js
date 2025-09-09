const mongoose = require('mongoose');



const testimonialSchema = new mongoose.Schema({
  name: String,
  designation: String,
  description: String,
  stars: Number,
  image:{
  filename: String,
  path: String,
}
});


module.exports = mongoose.model('Testimonials', testimonialSchema);
