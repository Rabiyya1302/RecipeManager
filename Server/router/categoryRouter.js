// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Recipe = require('../model/Recipes');

// Get recipes by category
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const recipes = await Recipe.find({ category });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
