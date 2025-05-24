const express = require('express');
const {
  createQuestion,
  renderQuestionsPage,
  renderAskQuestionPage,
  getQuestionById,
  renderQuestionPage,
  createAnswer,
  getAnswersByQuestionId,
  deleteQuestion,
  deleteAnswer
} = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(renderQuestionsPage).post(authMiddleware, createQuestion);
router.route('/ask').get(authMiddleware, renderAskQuestionPage)
router.route('/:id').get(renderQuestionPage).delete(authMiddleware, deleteQuestion);
router.route('/:id/answers').get(getAnswersByQuestionId).post(authMiddleware, createAnswer);
router.route('/:id/answers/:answerId').delete(authMiddleware, deleteAnswer);

module.exports = router;

