const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { MESSAGES } = require('../constants/messages');
const authRepository = require('./repositories/authRepository');

const signUp = async (body) => {
    try {
        const { name, email, password, confirmPassword } = body;

        if (!name) {
            return { status: 400, data: { message: MESSAGES.AUTH.NAME_REQUIRED } };
        }

        if (!email) {
            return { status: 400, data: { message: MESSAGES.AUTH.EMAIL_REQUIRED } };
        }

        if (!password) {
            return { status: 400, data: { message: MESSAGES.AUTH.PASSWORD_REQUIRED } };
        }

        if (password !== confirmPassword) {
            return {
                status: 400,
                data: {
                    message: MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH
                }
            };
        }

        const strongPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!strongPassword.test(password)) {
            return {
                status: 400,
                data: {
                    message: MESSAGES.AUTH.PASSWORD_STRENGTH
                }
            };
        }

        const existingUser = await authRepository.findUserByEmail(email);

        if (existingUser) {
            return {
                status: 409,
                data: {
                    message: MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED
                }
            };
        }

        await authRepository.createUser({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password
        });

        return {
            status: 201,
            data: {
                message: MESSAGES.AUTH.USER_CREATED_SUCCESSFULLY
            }
        };
    } catch (error) {
        if (error.code === 11000) {
            return {
                status: 409,
                data: {
                    message: MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED
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

const logIn = async (body) => {
    const { email, password } = body;

    try {
        if (!email || !password) {
            return {
                status: 400,
                data: {
                    message: MESSAGES.AUTH.EMAIL_AND_PASSWORD_REQUIRED
                }
            };
        }

        const user = await authRepository.findUserByEmailWithPassword(email);

        if (!user) {
            return {
                status: 401,
                data: {
                    message: MESSAGES.AUTH.INVALID_CREDENTIALS
                }
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {
                status: 401,
                data: {
                    message: MESSAGES.AUTH.INVALID_CREDENTIALS
                }
            };
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return {
            status: 200,
            data: {
                message: MESSAGES.AUTH.LOGIN_SUCCESSFUL,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        };
    } catch (error) {
        console.error(MESSAGES.AUTH.LOGIN_ERROR, error.message);

        return {
            status: 500,
            data: {
                message: MESSAGES.COMMON.INTERNAL_SERVER_ERROR
            }
        };
    }
};

const getMyProfile = async (userId) => {
    try {
        const user = await authRepository.findUserById(userId);

        if (!user) {
            return {
                status: 404,
                data: {
                    message: MESSAGES.AUTH.USER_NOT_FOUND
                }
            };
        }

        return {
            status: 200,
            data: {
                user
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

module.exports = { signUp, logIn, getMyProfile };
