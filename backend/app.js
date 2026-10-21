const dotenv = require('dotenv');
const { startServer } = require('./config/server');

dotenv.config();

startServer();