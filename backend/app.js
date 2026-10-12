const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/auth',authRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log("Server is running at: ", PORT);
        });
    }
    catch (error) {
        console.error('Server startup failed:', err.message);
        process.exit(1);
    }
}

startServer();