const mongoose = require('mongoose');
const { MESSAGES } = require('../constants/messages');
const userRepository = require('./repositories/userRepository');

const getCategories = async () => {
    try {
        const result = await userRepository.getCategories();

        return {
            status: 200,
            data: {
                message: MESSAGES.USER.CATEGORIES_RETURNED_SUCCESSFULLY,
                data: result
            }
        };
    } catch (error) {
        return {
            status: 500,
            data: {
                message: MESSAGES.COMMON.INTERNAL_SERVER_ERROR
            }
        };
    }
};

const getQuestionByCategory = async (categoryId) => {
    try {
        if (!mongoose.isValidObjectId(categoryId)) {
            return {
                status: 400,
                data: {
                    message: MESSAGES.COMMON.INVALID_CATEGORY_ID
                }
            };
        }

        const questions = await userRepository.getQuestionByCategory(categoryId);

        return {
            status: 200,
            data: {
                message: MESSAGES.USER.QUESTIONS_RETURNED_SUCCESSFULLY,
                data: questions
            }
        };
    } catch (error) {
        console.error(error.message);

        return {
            status: 500,
            data: {
                message: MESSAGES.COMMON.INTERNAL_SERVER_ERROR
            }
        };
    }
};

const submitQuiz = async (categoryId, answers, userId) => {
    try {
        let score = 0;
        let questions = [];

        for (const el of answers) {
            const question = await userRepository.getQuestionByCategoryAndId(el.questionId, categoryId);

            if (!question) {
                return {
                    status: 404,
                    data: {
                        message: MESSAGES.ADMIN.QUESTION_NOT_FOUND_IN_CATEGORY
                    }
                };
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

        const totalQuestions = answers.length;

        await userRepository.createQuizAttempt({
            user: userId,
            category: categoryId,
            questions,
            score,
            totalQuestions
        });

        return {
            status: 200,
            data: {
                message: MESSAGES.USER.QUIZ_EVALUATED_SUCCESSFULLY,
                score,
                totalQuestions: answers.length,
                percentage: answers.length
                    ? Number(((score / answers.length) * 100).toFixed(2))
                    : 0
            }
        };
    } catch (error) {
        console.log(error.message);
        return {
            status: 500,
            data: {
                message: MESSAGES.COMMON.INTERNAL_SERVER_ERROR
            }
        };
    }
};

const getQuizHistory = async (userId) => {
    try {
        const result = await userRepository.getQuizHistory(userId);

        return {
            status: 200,
            data: {
                message: MESSAGES.USER.QUIZ_HISTORY_RETURNED_SUCCESSFULLY,
                data: result
            }
        };
    } catch (error) {
        console.log(error.message);
        return {
            status: 500,
            data: {
                message: MESSAGES.COMMON.INTERNAL_SERVER_ERROR
            }
        };
    }
};

const deleteQuizHistory = async (attemptId, userId) => {
    try {
        if (!mongoose.isValidObjectId(attemptId)) {
            return {
                status: 400,
                data: {
                    message: MESSAGES.COMMON.INVALID_ATTEMPT_ID
                }
            };
        }

        const result = await userRepository.deleteQuizHistory(attemptId, userId);

        if (!result) {
            return {
                status: 404,
                data: {
                    message: MESSAGES.USER.QUIZ_ATTEMPT_NOT_FOUND
                }
            };
        }

        return {
            status: 200,
            data: {
                message: MESSAGES.USER.QUIZ_ATTEMPT_DELETED_SUCCESSFULLY,
                data: result
            }
        };
    } catch (error) {
        console.error(error.message);

        return {
            status: 500,
            data: {
                message: MESSAGES.COMMON.INTERNAL_SERVER_ERROR
            }
        };
    }
};

const getDashboardStats = async (userId) => {
    try {
        console.log(MESSAGES.USER.DASHBOARD_STATS_REQUEST, userId);

        if (!userId) {
            return {
                status: 401,
                data: {
                    message: MESSAGES.COMMON.USER_NOT_AUTHENTICATED
                }
            };
        }

        const stats = await userRepository.getDashboardStats(userId);

        const result = stats[0] || {};

        return {
            status: 200,
            data: {
                totalQuizzes: result.totalQuizzes || 0,
                bestPercentage: Number((result.bestPercentage || 0).toFixed(2)),
                accuracy: result.totalQuestions
                    ? Number(((result.totalCorrect || 0) / result.totalQuestions * 100).toFixed(2))
                    : 0
            }
        };
    } catch (error) {
        console.error(MESSAGES.USER.DASHBOARD_STATS_ERROR, error);
        return {
            status: 500,
            data: {
                message: MESSAGES.COMMON.INTERNAL_SERVER_ERROR
            }
        };
    }
};

module.exports = {
    getCategories,
    getQuestionByCategory,
    submitQuiz,
    getQuizHistory,
    deleteQuizHistory,
    getDashboardStats
};
