const mongoose = require('mongoose');


const pageSchema = new mongoose.Schema({
  page_name: { type: String, required: true },
  design_projects_completed: Number,
  client_satisfaction_rate: Number,
  years_of_experience: Number,
});

module.exports = mongoose.model('Page', pageSchema);
