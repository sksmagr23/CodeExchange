const express = require('express');
const {
  searchStackOverflowQuestions,
  getStackOverflowQuestion
} = require('../controllers/stackoverflowController');

const router = express.Router();

router.get('/search', searchStackOverflowQuestions);
router.get('/question/:id', getStackOverflowQuestion);

module.exports = router;