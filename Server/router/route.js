const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const Recipe = require("../model/Recipes");

dotenv.config();

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new recipe
router.post("/recipe", upload.single("image"), async (req, res) => {
  const { recipeTitle, ingredients, steps } = req.body;

  if (!recipeTitle || !ingredients || !steps || !req.file) {
    return res.status(400).json({
      message: "All fields (title, ingredients, steps, and image) are required.",
    });
  }

  try {
    if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Invalid image type. Only JPEG or PNG is allowed." });
    }

    const imageBase64 = req.file.buffer.toString("base64");

    const newRecipe = new Recipe({
      title: recipeTitle,
      ingredients: ingredients.split(",").map((item) => item.trim()),
      steps: steps.split(",").map((step) => step.trim()),
      image: [imageBase64],
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all recipes
router.get("/recipe", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a recipe
router.put("/recipe/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { recipeTitle, ingredients, steps } = req.body;

  if (!recipeTitle || !ingredients || !steps) {
    return res.status(400).json({
      message: "All fields (title, ingredients, and steps) are required.",
    });
  }

  try {
    const updateData = {
      title: recipeTitle,
      ingredients: ingredients.split(",").map((item) => item.trim()),
      steps: steps.split(",").map((step) => step.trim()),
    };

    if (req.file) {
      if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
        return res
          .status(400)
          .json({ message: "Invalid image type. Only JPEG or PNG is allowed." });
      }
      updateData.image = [req.file.buffer.toString("base64")];
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a recipe
router.delete("/recipe/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
