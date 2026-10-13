const express = require('express');
const { signUp, logIn, getMyProfile } = require('../controllers/authController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/signup',signUp);
router.post('/login',logIn);
router.get('/me',auth,getMyProfile);

module.exports = router;