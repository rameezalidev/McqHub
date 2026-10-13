const express = require('express');
const { addCategory, deleteCategory, addQuestion, deleteQuestion } = require('../controllers/adminController');
const authorizeRoles = require('../middlewares/role');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/categories', auth, authorizeRoles('admin'), addCategory);
router.delete('/categories/:id', auth, authorizeRoles('admin'), deleteCategory);

router.post('/categories/:categoryId/questions', auth, authorizeRoles('admin'), addQuestion);
router.delete('/categories/:categoryId/questions/:questionId', auth, authorizeRoles('admin'), deleteQuestion);
module.exports = router;