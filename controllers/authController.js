const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ username, email, password });

  if (user) {
    res.cookie('token', generateToken(user._id), { httpOnly: true });
    res.redirect('/');
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.cookie('token', generateToken(user._id), { httpOnly: true });
    res.redirect('/');
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
  
exports.logout = (req, res) => {
  res.clearCookie('token'); 
  res.redirect('/');
};