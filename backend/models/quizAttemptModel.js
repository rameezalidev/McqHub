
const mongoose = require('mongoose');

const attemptedQuestionSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
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
        validate: {
            validator: options => options.length === 4,
            message: 'Exactly 4 options are required'
        }
    },
    correctAnswer: {
        type: String,
        required: true
    },
    selectedAnswer: {
        type: String,
        default: null
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
}, {
    _id: false
});

const quizAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    questions: {
        type: [attemptedQuestionSchema],
        required: true,
        validate: {
            validator: questions => questions.length >= 10,
            message: 'A quiz must contain atleast 10 questions'
        }
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    totalQuestions: {
        type: Number,
        required: true,
        min: 10
    }
}, {
    timestamps: true
});


quizAttemptSchema.pre('validate', function() {
    if (this.score > this.totalQuestions) {
        this.invalidate(
            'score',
            'Score cannot exceed total questions'
        );
    }
});
module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
