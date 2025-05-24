const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');

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
    res.status(400).json({ message: 'No such user found' });
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

exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect('/login?error=oauth_error');
    }
    
    if (!user) {
      return res.redirect('/login?error=oauth_failed');
    }

    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  })(req, res, next);
};
  
exports.logout = (req, res) => {
  res.clearCookie('token'); 
  res.redirect('/');
};