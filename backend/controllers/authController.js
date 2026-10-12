const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const signUp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords don't match"
            });
        }

        const strongPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!strongPassword.test(password)) {
            return res.status(400).json({
                message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
            });
        }

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email is already registered'
            });
        }

        await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password
        });

        return res.status(201).json({
            message: 'User created successfully!'
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email is already registered'
            });
        }

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

const logIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            user
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }

};

module.exports = { signUp, logIn, getMyProfile };