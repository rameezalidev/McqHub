const test = require('node:test');
const assert = require('node:assert/strict');

const userRepository = require('../services/repositories/userRepository');
const authRepository = require('../services/repositories/authRepository');
const adminRepository = require('../services/repositories/adminRepository');

test('repository modules expose database query methods', () => {
  assert.equal(typeof userRepository.getCategories, 'function');
  assert.equal(typeof userRepository.getQuestionByCategory, 'function');
  assert.equal(typeof userRepository.submitQuiz, 'function');
  assert.equal(typeof userRepository.getQuizHistory, 'function');
  assert.equal(typeof userRepository.deleteQuizHistory, 'function');
  assert.equal(typeof userRepository.getDashboardStats, 'function');

  assert.equal(typeof authRepository.findUserByEmail, 'function');
  assert.equal(typeof authRepository.createUser, 'function');
  assert.equal(typeof authRepository.findUserById, 'function');

  assert.equal(typeof adminRepository.addCategory, 'function');
  assert.equal(typeof adminRepository.deleteCategory, 'function');
  assert.equal(typeof adminRepository.addQuestion, 'function');
  assert.equal(typeof adminRepository.deleteQuestion, 'function');
  assert.equal(typeof adminRepository.getQuestionsByCategory, 'function');
});
