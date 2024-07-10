const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.createQuestion = async (req, res) => {
  const { title, description } = req.body;

  const question = new Question({
    title,
    description,
    user: req.user._id,
  });

  const createdQuestion = await question.save();
  res.redirect(`/questions/${createdQuestion._id}`);
};

exports.getQuestions = async (req, res) => {
  const questions = await Question.find().populate('user', 'username');
  res.json(questions);
};

exports.renderQuestionsPage = async (req, res) => {
  const questions = await Question.find().populate('user', 'username');
  res.render('questions', { title: 'Questions', questions, user: req.user });
};

exports.renderAskQuestionPage = (req, res) => {
  res.render('ask-question', {title:'Ask a Question', user:req.user});
}

exports.getQuestionById = async (req, res) => {
  const question = await Question.findById(req.params.id).populate('user', 'username');
  if (question) {
    res.json(question);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};

exports.renderQuestionPage = async (req, res) => {
  const question = await Question.findById(req.params.id).populate('user', 'username');
  const answers = await Answer.find({ question: req.params.id }).populate('user', 'username');
  if (question) {
    res.render('question', { title: 'Question', question, answers, user: req.user });
  } else {
    res.status(404).render('404', { title: 'Question not found', user: req.user });
  }
};

exports.createAnswer = async (req, res) => {
  const { text } = req.body;

  const answer = new Answer({
    text,
    user: req.user._id,
    question: req.params.id,
  });

  const createdAnswer = await answer.save();
  res.status(201).json(createdAnswer);
};

exports.getAnswersByQuestionId = async (req, res) => {
  const answers = await Answer.find({ question: req.params.id }).populate('user', 'username');
  res.json(answers);
};
