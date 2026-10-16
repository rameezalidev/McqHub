const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')
const aiRoutes = require('./routes/aiRoutes')
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/users',userRoutes);
app.use("/api/ai", aiRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log("Server is running at: ", PORT);
        });
    }
    catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
}

startServer();