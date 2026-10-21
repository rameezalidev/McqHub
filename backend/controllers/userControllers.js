const userService = require('../services/userService');

const getCategories = async (req, res) => {
    const result = await userService.getCategories();
    return res.status(result.status).json(result.data);
};

const getQuestionByCategory = async (req, res) => {
    const result = await userService.getQuestionByCategory(req.params.categoryId);
    return res.status(result.status).json(result.data);
};

const submitQuiz = async (req, res) => {
    const result = await userService.submitQuiz(req.body.categoryId, req.body.answers, req.user.userId);
    return res.status(result.status).json(result.data);
};

const getQuizHistory = async (req, res) => {
    const result = await userService.getQuizHistory(req.user.userId);
    return res.status(result.status).json(result.data);
};

const deleteQuizHistory = async (req, res) => {
    const result = await userService.deleteQuizHistory(req.params.attemptId, req.user.userId);
    return res.status(result.status).json(result.data);
};

const getDashboardStats = async (req, res) => {
    const result = await userService.getDashboardStats(req.user?.userId);
    return res.status(result.status).json(result.data);
};

module.exports = { getCategories, getQuestionByCategory, submitQuiz, getQuizHistory, deleteQuizHistory, getDashboardStats };
