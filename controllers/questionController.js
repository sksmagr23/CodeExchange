const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { marked } = require('marked');

exports.createQuestion = async (req, res) => {
  const { title, description, tags } = req.body;

  try {
    let processedTags = [];
    if (tags) {
      processedTags = tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0)
        .slice(0, 5);
    }

    const question = new Question({
      title,
      description,
      tags: processedTags,
      user: req.user._id,
    });

    const createdQuestion = await question.save();

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
  const answers = await Answer.find({ question: req.params.id }).populate('user', 'username')
  if (question) {
    // Convert markdown to HTML
    const markdownDescription = marked(question.description);
    res.render('question', { 
      title: 'Question', 
      question, 
      answers, 
      user: req.user,
      markdownDescription 
    });
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

exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    
    if (answer.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Answer.deleteOne({ _id: req.params.answerId });
    await User.updateOne(
      { _id: req.user._id }, 
      { $pull: { answers: req.params.answerId } }
    );
    
    res.json({ message: 'Answer deleted' });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ message: 'Error deleting answer' });
  }
};