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
  deleteAnswer,
  updateQuestion,
  updateAnswer,
  likeAnswer
} = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(renderQuestionsPage).post(authMiddleware, createQuestion);
router.route('/ask').get(authMiddleware, renderAskQuestionPage)
router.route('/:id')
  .get(renderQuestionPage)
  .put(authMiddleware, updateQuestion)
  .delete(authMiddleware, deleteQuestion);
  
router.route('/:id/answers').get(getAnswersByQuestionId).post(authMiddleware, createAnswer);
router.route('/:id/answers/:answerId')
  .put(authMiddleware, updateAnswer)
  .delete(authMiddleware, deleteAnswer);
router.route('/:id/answers/:answerId/like')
  .post(authMiddleware, likeAnswer);

module.exports = router;

