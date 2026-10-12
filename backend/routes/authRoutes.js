const express = require('express');
const { signUp, logIn, getMyProfile } = require('../controllers/authController');
const auth = require('../middlewares/auth');
const Router = express.Router();

Router.post('/signup',signUp);
Router.post('/login',logIn);
Router.get('/me',auth,getMyProfile);

module.exports = Router;