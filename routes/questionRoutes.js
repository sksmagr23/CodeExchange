const express = require('express');
const {
  createQuestion,
  renderQuestionsPage,
  renderAskQuestionPage,
  getQuestionById,
  renderQuestionPage,
  createAnswer,
  getAnswersByQuestionId,
} = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(renderQuestionsPage).post(authMiddleware, createQuestion);
router.route('/ask').get(authMiddleware, renderAskQuestionPage)
router.route('/:id').get(renderQuestionPage);
router.route('/:id/answers').get(getAnswersByQuestionId).post(authMiddleware, createAnswer);

module.exports = router;

