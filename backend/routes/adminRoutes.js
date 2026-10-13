const express = require('express');
const { addCategory, deleteCategory, addQuestion, deleteQuestion } = require('../controllers/adminController');
const authorizeRoles = require('../middlewares/role');
const auth = require('../middlewares/auth');
const Router = express.Router();

Router.post('/category', auth, authorizeRoles("admin"), addCategory);
Router.delete('/category/:id', auth, authorizeRoles("admin"), deleteCategory);


Router.post('/question', auth, authorizeRoles("admin"), addQuestion);
Router.delete('/question/:id', auth, authorizeRoles("admin"), deleteQuestion);
module.exports = Router;