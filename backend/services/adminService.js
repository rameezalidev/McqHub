const mongoose = require('mongoose');
const { MESSAGES } = require('../constants/messages');
const adminRepository = require('./repositories/adminRepository');

const addCategory = async (body) => {
    const { name, description } = body;

    try {
        if (!name) {
            return { status: 400, data: { message: MESSAGES.ADMIN.CATEGORY_REQUIRED } };
        }

        await adminRepository.addCategory({
            name,
            description
        });

        return {
            status: 200,
            data: {
                message: MESSAGES.ADMIN.CATEGORY_ADDED,
                data: {
                    name,
                    description
                }
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

const deleteCategory = async (id) => {
    try {
        const category = await adminRepository.deleteCategory(id);

        if (!category) {
            return {
                status: 404,
                data: {
                    message: MESSAGES.ADMIN.CATEGORY_NOT_FOUND
                }
            };
        }

        return {
            status: 200,
            data: {
                message: MESSAGES.ADMIN.CATEGORY_DELETED_SUCCESSFULLY
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

const addQuestion = async (params, body) => {
    try {
        const { categoryId } = params;
        const { question, options, correctAnswer, difficultyLevel } = body;

        if (!mongoose.isValidObjectId(categoryId)) {
            return {
                status: 400,
                data: {
                    message: MESSAGES.COMMON.INVALID_CATEGORY_ID
                }
            };
        }

        const category = await adminRepository.getCategoryByIdAndActive(categoryId);

        if (!category) {
            return {
                status: 404,
                data: {
                    message: MESSAGES.ADMIN.CATEGORY_NOT_FOUND_OR_INACTIVE
                }
            };
        }

        const newQuestion = await adminRepository.addQuestion({
            category: category._id,
            question,
            options,
            correctAnswer,
            difficultyLevel
        });

        return {
            status: 201,
            data: {
                message: MESSAGES.ADMIN.QUESTION_CREATED_SUCCESSFULLY,
                question: newQuestion
            }
        };
    } catch (error) {
        if (error.name === 'ValidationError') {
            return {
                status: 400,
                data: {
                    message: error.message
                }
            };
        }

        return {
            status: 500,
            data: {
                message: MESSAGES.COMMON.INTERNAL_SERVER_ERROR
            }
        };
    }
};

const deleteQuestion = async (params) => {
    const { categoryId, questionId } = params;

    try {
        if (
            !mongoose.isValidObjectId(categoryId) ||
            !mongoose.isValidObjectId(questionId)
        ) {
            return {
                status: 400,
                data: {
                    message: MESSAGES.COMMON.INVALID_CATEGORY_ID_OR_QUESTION_ID
                }
            };
        }

        const question = await adminRepository.deleteQuestion(categoryId, questionId);

        if (!question) {
            return {
                status: 404,
                data: {
                    message: MESSAGES.ADMIN.QUESTION_NOT_FOUND_IN_CATEGORY
                }
            };
        }

        return {
            status: 200,
            data: {
                message: MESSAGES.ADMIN.QUESTION_DELETED_SUCCESSFULLY
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

const getQuestionsByCategory = async (params) => {
    const { categoryId } = params;

    try {
        if (!mongoose.isValidObjectId(categoryId)) {
            return {
                status: 400,
                data: {
                    message: MESSAGES.COMMON.INVALID_CATEGORY_ID
                }
            };
        }

        const questions = await adminRepository.getQuestionsByCategory(categoryId);

        return {
            status: 200,
            data: {
                message: MESSAGES.ADMIN.QUESTIONS_RETRIEVED_SUCCESSFULLY,
                data: questions
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

module.exports = { addCategory, deleteCategory, addQuestion, deleteQuestion, getQuestionsByCategory };
