const express = require('express');
const authorizeRoles = require('../middlewares/role');
const auth = require('../middlewares/auth');
const { getCategories, getQuestionByCategory,submitQuiz, getQuizHistory, getDashboardStats } = require('../controllers/userControllers');
const router = express.Router();

router.get('/categories',auth, getCategories);
router.get('/categories/:categoryId/questions',auth, getQuestionByCategory);
router.post('/quizzes/submit',auth, submitQuiz);
router.get('/quizzes/history',auth,getQuizHistory);
router.get('/dashboard/stats', auth, getDashboardStats);
module.exports = router;