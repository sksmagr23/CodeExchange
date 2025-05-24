const express = require('express');
const { registerUser, loginUser, logout, googleAuth, googleCallback } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router;

