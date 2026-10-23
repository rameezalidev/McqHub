const User = require('../../models/userModel');

const findUserByEmail = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    return User.findOne({ email: normalizedEmail });
};

const findUserByEmailWithPassword = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    return User.findOne({ email: normalizedEmail }).select('+password');
};

const findUserById = async (userId) => User.findById(userId);

const createUser = async (data) => User.create(data);

module.exports = {
    findUserByEmail,
    findUserByEmailWithPassword,
    findUserById,
    createUser
};
