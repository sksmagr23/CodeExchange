const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'questions',
        model: Question,
        select: 'title description createdAt',
      })
      .populate({
        path: 'answers',
        model: Answer,
        select: 'text createdAt',
        populate: {
          path: 'question',
          model: Question,
          select: 'title'
        }
      });

    res.render('profile', { user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};