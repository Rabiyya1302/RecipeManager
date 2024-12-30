const mongoose = require('mongoose');
const mealPlanSchema = new mongoose.Schema({
    day: { type: String, required: true },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true }],
    createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model("mealPlan", mealPlanSchema)