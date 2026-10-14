const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const Question = require('../models/questionModel');
const QuizAttempt = require('../models/quizAttemptModel')


const getCategories = async (req, res) => {
    try {
        const result = await Category.find();

        return res.json({
            message: "Succesfully returned categories",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}


const getQuestionByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!mongoose.isValidObjectId(categoryId)) {
            return res.status(400).json({
                message: 'Invalid category ID'
            });
        }

        const questions = await Question.aggregate([
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

        return res.status(200).json({
            message: 'Successfully returned random questions',
            data: questions
        });
    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};


const submitQuiz = async (req, res) => {
    const { categoryId, answers } = req.body;

    try {
        let score = 0;
        let questions = [];
        for (const el of answers) {
            const question = await Question.findOne({
                _id: el.questionId,
                category: categoryId
            });

            if (!question) {
                return res.status(404).json({
                    message: 'Question not found in this category'
                });
            }
            const isCorrect = el.selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
            questions.push({
                questionId: question._id,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                selectedAnswer: el.selectedAnswer,
                isCorrect
            });
            if (isCorrect) {
                score++;
            }
        }


        const userId = req.user.userId;
        const totalQuestions = answers.length;

        await QuizAttempt.create({
            user: userId,
            category: categoryId,
            questions,
            score,
            totalQuestions
        })

        return res.status(200).json({
            message: 'Quiz evaluated successfully',
            score,
            totalQuestions: answers.length,
            percentage: answers.length
                ? Number(((score / answers.length) * 100).toFixed(2))
                : 0
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

const getQuizHistory = async (req,res) => {
    try{
        const result = await QuizAttempt.find({user: req.user.userId});

        return res.status(200).json({
            message: "Quiz history returned successfully",
            data: result
        })
    }catch(error) {
        console.log(error.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    } 
}

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const stats = await QuizAttempt.aggregate([
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

        const result = stats[0];

        return res.status(200).json({
            totalQuizzes: result?.totalQuizzes || 0,
            bestPercentage: Number(
                (result?.bestPercentage || 0).toFixed(2)
            ),
            accuracy: result?.totalQuestions
                ? Number(
                    (
                        result.totalCorrect /
                        result.totalQuestions *
                        100
                    ).toFixed(2)
                )
                : 0
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};
module.exports = { getCategories, getQuestionByCategory, submitQuiz, getQuizHistory, getDashboardStats }
