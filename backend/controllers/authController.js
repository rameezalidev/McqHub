const authService = require('../services/authService');

const signUp = async (req, res) => {
    const result = await authService.signUp(req.body);
    return res.status(result.status).json(result.data);
};

const logIn = async (req, res) => {
    const result = await authService.logIn(req.body);
    return res.status(result.status).json(result.data);
};

const getMyProfile = async (req, res) => {
    const result = await authService.getMyProfile(req.user.userId);
    return res.status(result.status).json(result.data);
};

module.exports = { signUp, logIn, getMyProfile };