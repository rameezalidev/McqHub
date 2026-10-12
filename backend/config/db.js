const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('MONGO_URI is missing from environment variables');
        }
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully!");
    } catch (error) {
        console.log("Error Connecting database", err.message);
        throw  error;
    }
}

module.exports = connectDB;