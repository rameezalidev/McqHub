const Category = require('../models/categoryModel');
const Question = require('../models/questionModel');
const mongoose = require('mongoose');
const addCategory = async (req, res) => {
    const { name, description } = req.body;
    console.log("In add cat")
    try {
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        await Category.create({
            name,
            description
        });

        return res.status(200).json({
            message: "Category added",
            data: {
                name, description
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        return res.status(200).json({
            message: 'Category deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const addQuestion = async (req, res) => {
    try {
        const { question, options, correctAnswer, difficultyLevel } = req.body;
        const { categoryId } = req.params;
        if (!mongoose.isValidObjectId(categoryId)) {
            return res.status(400).json({
                message: 'Invalid category ID'
            });
        }

        const category = await Category.findOne({
            _id: categoryId,
            isActive: true
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found or inactive'
            });
        }

        const newQuestion = await Question.create({
            category: category._id,
            question,
            options,
            correctAnswer,
            difficultyLevel
        });

        return res.status(201).json({
            message: 'Question created successfully',
            question: newQuestion
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const deleteQuestion = async (req, res) => {
    const { categoryId, questionId } = req.params;

    try {
        if (
            !mongoose.isValidObjectId(categoryId) ||
            !mongoose.isValidObjectId(questionId)
        ) {
            return res.status(400).json({
                message: 'Invalid category ID or question ID'
            });
        }

        const question = await Question.findOneAndDelete({
            _id: questionId,
            category: categoryId
        });

        if (!question) {
            return res.status(404).json({
                message: 'Question not found in this category'
            });
        }

        return res.status(200).json({
            message: 'Question deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};


module.exports = { addCategory, deleteCategory, addQuestion, deleteQuestion };