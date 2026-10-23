const Category = require('../../models/categoryModel');
const Question = require('../../models/questionModel');

const addCategory = async (payload) => Category.create(payload);

const deleteCategory = async (id) => Category.findByIdAndDelete(id);

const getCategoryByIdAndActive = async (categoryId) => {
    return Category.findOne({
        _id: categoryId,
        isActive: true
    });
};

const addQuestion = async (payload) => Question.create(payload);

const deleteQuestion = async (categoryId, questionId) => {
    return Question.findOneAndDelete({
        _id: questionId,
        category: categoryId
    });
};

const getQuestionsByCategory = async (categoryId) => Question.find({ category: categoryId });

module.exports = {
    addCategory,
    deleteCategory,
    getCategoryByIdAndActive,
    addQuestion,
    deleteQuestion,
    getQuestionsByCategory
};
