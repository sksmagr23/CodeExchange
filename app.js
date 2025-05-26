const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware')
const Question = require('./models/Question')
const Answer = require('./models/Answer')
const { getUserProfile } = require('./controllers/userController')
const passport = require('./config/passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const stackoverflowRoutes = require('./routes/stackoverflowRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(authMiddleware);

app.use('/api/auth', authRoutes);
app.use('/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/stackoverflow', stackoverflowRoutes);

app.get('/', async (req, res) => {
  const questions = await Question.find().populate('user', 'username');
  res.render('index', { title: 'Home', questions, user: res.locals.user });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login'});
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.get('/profile', getUserProfile);

app.get('/questions/:id', async (req, res) => {
  const question = await Question.findById(req.params.id).populate('user', 'username');
  const answers = await Answer.find({ question: req.params.id }).populate('user', 'username');
  res.render('question', { title: 'Question', question, answers, user: req.user });
});

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

