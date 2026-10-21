const MESSAGES = {
    COMMON: {
        INTERNAL_SERVER_ERROR: 'Internal server error',
        INVALID_CATEGORY_ID: 'Invalid category ID',
        INVALID_CATEGORY_ID_OR_QUESTION_ID: 'Invalid category ID or question ID',
        INVALID_ATTEMPT_ID: 'Invalid attempt ID',
        USER_NOT_AUTHENTICATED: 'User not authenticated'
    },
    AUTH: {
        NAME_REQUIRED: 'Name is required',
        EMAIL_REQUIRED: 'Email is required',
        PASSWORD_REQUIRED: 'Password is required',
        PASSWORDS_DO_NOT_MATCH: "Passwords don't match",
        PASSWORD_STRENGTH: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
        EMAIL_ALREADY_REGISTERED: 'Email is already registered',
        USER_CREATED_SUCCESSFULLY: 'User created successfully!',
        EMAIL_AND_PASSWORD_REQUIRED: 'Email and password are required',
        INVALID_CREDENTIALS: 'Invalid email or password',
        USER_NOT_FOUND: 'User not found',
        LOGIN_SUCCESSFUL: 'Login successful',
        LOGIN_ERROR: 'Login error:'
    },
    ADMIN: {
        CATEGORY_REQUIRED: 'Name is required',
        CATEGORY_ADDED: 'Category added',
        CATEGORY_NOT_FOUND: 'Category not found',
        CATEGORY_DELETED_SUCCESSFULLY: 'Category deleted successfully',
        CATEGORY_NOT_FOUND_OR_INACTIVE: 'Category not found or inactive',
        QUESTION_CREATED_SUCCESSFULLY: 'Question created successfully',
        QUESTION_NOT_FOUND_IN_CATEGORY: 'Question not found in this category',
        QUESTION_DELETED_SUCCESSFULLY: 'Question deleted successfully',
        QUESTIONS_RETRIEVED_SUCCESSFULLY: 'Questions retrieved successfully'
    },
    USER: {
        CATEGORIES_RETURNED_SUCCESSFULLY: 'Succesfully returned categories',
        QUESTIONS_RETURNED_SUCCESSFULLY: 'Successfully returned random questions',
        QUIZ_EVALUATED_SUCCESSFULLY: 'Quiz evaluated successfully',
        QUIZ_HISTORY_RETURNED_SUCCESSFULLY: 'Quiz history returned successfully',
        QUIZ_ATTEMPT_DELETED_SUCCESSFULLY: 'Quiz attempt deleted successfully',
        QUIZ_ATTEMPT_NOT_FOUND: 'Quiz attempt not found',
        DASHBOARD_STATS_REQUEST: 'Dashboard stats request for user:',
        DASHBOARD_STATS_ERROR: 'getDashboardStats error:'
    }
};

module.exports = { MESSAGES };
