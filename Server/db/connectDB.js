const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URI
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment');
}

async function connectDB() {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(MONGO_URI, {

        });

        // Confirm the connection
        console.log('Successfully connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process if connection fails
    }
}

module.exports = { connectDB };
