const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
  register,
  login,
  getMe,
  updateQuickAccessConfigurations
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
        displayName: user.displayName,
        quickAccessConfigurations: []
      }, 
      token 
    });
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `${field} already exists` });
    } else if (error.name === 'ValidationError') {
      // validation error
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: 'Validation Error', errors });
    } else {
      res.status(400).json({ message: 'Error registering user', error: error.message });
    }
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        displayName: user.displayName,
        quickAccessConfigurations: user.quickAccessConfigurations
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

async function updateQuickAccessConfigurations(req, res) {
  try {
    const { quickAccessConfigurations } = req.body;
    
    // uniqueness check
    if (new Set(quickAccessConfigurations).size !== quickAccessConfigurations.length) {
      return res.status(400).json({ message: 'Duplicate configuration IDs are not allowed' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { quickAccessConfigurations },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation Error', error: error.message });
    } else {
      res.status(400).json({ message: 'Error updating quick access configurations', error: error.message });
    }
  }
}