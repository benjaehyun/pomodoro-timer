const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
  register,
  login,
  getMe
};

async function register(req, res) {
  try {
    const { username, email, password, displayName } = req.body;
    const user = new User({ username, email, password, displayName });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        displayName: user.displayName 
      }, 
      token 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        displayName: user.displayName 
      }, 
      token 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user data', error: error.message });
  }
}