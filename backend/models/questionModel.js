const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: {
        type: [String],
        required: true,
        validate: [
            {
                validator: options => options.length === 4,
                message: 'Exactly 4 options are required'
            },
            {
                validator: options => options.every(
                    option => typeof option === 'string' && option.trim().length > 0
                ),
                message: 'All options must be non-empty strings'
            }
        ]
    },
    correctAnswer: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (answer) {
                return this.options.some(
                    option => option.toLowerCase() === answer.toLowerCase()
                );
            },
            message: 'Correct answer must match one of the options'
        }
    },
    difficultyLevel: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);