const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: String,
  designation: String,
  description: String,
  stars: Number,
});

const aboutSchema = new mongoose.Schema({
  description1: String,
  description2: String,
});

const pageSchema = new mongoose.Schema({
  page_name: { type: String, required: true },
  about_section: aboutSchema,
  testimonials: [testimonialSchema],
  design_projects_completed: Number,
  client_satisfaction_rate: Number,
  years_of_experience: Number,
});

module.exports = mongoose.model('Page', pageSchema);
