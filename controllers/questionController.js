const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.createQuestion = async (req, res) => {
  const { title, description } = req.body;

  try {
    const question = new Question({
      title,
      description,
      user: req.user._id,
    });

    const createdQuestion = await question.save();

    // Update user with the new question
    await User.findByIdAndUpdate(req.user._id, {
      $push: { questions: createdQuestion._id },
    });

    res.redirect(`/questions/${createdQuestion._id}`);
  } catch (error) {
    res.status(500).json({ message: 'Error creating question' });
  }
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

  try {
    const answer = new Answer({
      text,
      user: req.user._id,
      question: req.params.id,
    });

    const createdAnswer = await answer.save();

    // Update user with the new answer
    await User.findByIdAndUpdate(req.user._id, {
      $push: { answers: createdAnswer._id },
    });

    res.redirect(`/questions/${req.params.id}`);
  } catch (error) {
    res.status(500).json({ message: 'Error creating answer' });
  }
};

exports.getAnswersByQuestionId = async (req, res) => {
  const answers = await Answer.find({ question: req.params.id }).populate('user', 'username');
  res.json(answers);
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      console.error('Question not found');
      return res.status(404).json({ message: 'Question not found' });
    }
    if (question.user.toString() !== req.user._id.toString()) {
      console.error('Not authorized to delete this question');
      return res.status(401).json({ message: 'Not authorized' });
    }
    await Question.deleteOne({ _id: req.params.id });
    await User.updateOne({ _id: req.user._id }, { $pull: { questions: req.params.id } });
    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Error deleting question' });
  }
};
