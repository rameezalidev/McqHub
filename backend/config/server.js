const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('../routes/authRoutes');
const adminRoutes = require('../routes/adminRoutes');
const userRoutes = require('../routes/userRoutes');
const aiRoutes = require('../routes/aiRoutes');

const app = express();

const registerMiddlewares = () => {
    app.use(cors());
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/ai', aiRoutes);
};

const startServer = async (port = process.env.PORT || 3001) => {
    try {
        await connectDB();
        registerMiddlewares();

        app.listen(port, () => {
            console.log('Server is running at:', port);
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

module.exports = { app, startServer };
