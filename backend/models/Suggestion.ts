const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
