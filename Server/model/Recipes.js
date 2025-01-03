const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  steps: [{ type: String, required: true }],
  image: [{ type: String, required: true }],
  // Ensure image is required
});

module.exports = mongoose.model('Recipe', recipeSchema);
