const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./db/connectDB');
const recipeRoutes = require('./router/route');
const mealPlanRoute=require('./router/mealPlanRoute');
const favoriteRoute=require('./router/favoriteRoute');
const categoryRoutes=require('./router/categoryRouter')

dotenv.config();

const App = express();
const PORT = process.env.PORT || 3000;

// Middleware
App.use(express.json({ limit: '10mb' }));
App.use(express.urlencoded({ limit: '10mb', extended: true }));
App.use(
  cors({
    origin: 'http://localhost:8081', // Update this to match your frontend URL
  })
);

// API Routes
App.use('/api', recipeRoutes);
App.use("/api",mealPlanRoute)
App.use("/api",categoryRoutes)
App.use("/api",favoriteRoute)

const start = async () => {
  try {
    await connectDB(); // Ensure the database connection is established
    App.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
  }
};

start();
