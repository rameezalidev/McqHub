const mongoose = require('mongoose');
const Category = require('../../models/categoryModel');
const Question = require('../../models/questionModel');
const QuizAttempt = require('../../models/quizAttemptModel');

const getCategories = async () => Category.find();

const getQuestionByCategory = async (categoryId) => {
    return Question.aggregate([
        {
            $match: {
                category: new mongoose.Types.ObjectId(categoryId)
            }
        },
        {
            $sample: { size: 10 }
        },
        {
            $project: {
                correctAnswer: 0
            }
        }
    ]);
};

const getQuestionByCategoryAndId = async (questionId, categoryId) => {
    return Question.findOne({
        _id: questionId,
        category: categoryId
    });
};

const createQuizAttempt = async (payload) => QuizAttempt.create(payload);

const submitQuiz = async (payload) => QuizAttempt.create(payload);

const getQuizHistory = async (userId) => QuizAttempt.find({ user: userId });

const deleteQuizHistory = async (attemptId, userId) => {
    return QuizAttempt.findOneAndDelete({
        _id: attemptId,
        user: userId
    });
};

const getDashboardStats = async (userId) => {
    return QuizAttempt.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalQuizzes: { $sum: 1 },
                totalCorrect: { $sum: '$score' },
                totalQuestions: { $sum: '$totalQuestions' },
                bestPercentage: {
                    $max: {
                        $multiply: [
                            { $divide: ['$score', '$totalQuestions'] },
                            100
                        ]
                    }
                }
            }
        }
    ]);
};

module.exports = {
    getCategories,
    getQuestionByCategory,
    getQuestionByCategoryAndId,
    createQuizAttempt,
    submitQuiz,
    getQuizHistory,
    deleteQuizHistory,
    getDashboardStats
};
