const adminService = require('../services/adminService');

const addCategory = async (req, res) => {
    const result = await adminService.addCategory(req.body);
    return res.status(result.status).json(result.data);
};

const deleteCategory = async (req, res) => {
    const result = await adminService.deleteCategory(req.params.id);
    return res.status(result.status).json(result.data);
};

const addQuestion = async (req, res) => {
    const result = await adminService.addQuestion(req.params, req.body);
    return res.status(result.status).json(result.data);
};

const deleteQuestion = async (req, res) => {
    const result = await adminService.deleteQuestion(req.params);
    return res.status(result.status).json(result.data);
};

const getQuestionsByCategory = async (req, res) => {
    const result = await adminService.getQuestionsByCategory(req.params);
    return res.status(result.status).json(result.data);
};

module.exports = { addCategory, deleteCategory, addQuestion, deleteQuestion, getQuestionsByCategory };