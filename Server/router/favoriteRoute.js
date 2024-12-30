// routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const Recipe = require('../model/Recipes'); // Assuming the model is in a models folder

// Mark recipe as favorite
router.put("/recipe/:id/favorite", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, { favorite: true }, { new: true });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe marked as favorite", recipe });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Unmark recipe as favorite
router.put("/recipe/:id/unfavorite", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, { favorite: false }, { new: true });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe unmarked as favorite", recipe });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all favorite recipes
router.get("/recipe/favorites", async (req, res) => {
  try {
    const favorites = await Recipe.find({ favorite: true });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
