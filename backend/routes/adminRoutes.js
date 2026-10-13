const express = require('express');
const { addCategory, deleteCategory, addQuestion, deleteQuestion } = require('../controllers/adminController');
const authorizeRoles = require('../middlewares/role');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/category', auth, authorizeRoles("admin"), addCategory);
router.delete('/category/:id', auth, authorizeRoles("admin"), deleteCategory);


router.post('/question', auth, authorizeRoles("admin"), addQuestion);
router.delete('/question/:id', auth, authorizeRoles("admin"), deleteQuestion);
module.exports = router;