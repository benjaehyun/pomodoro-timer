import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';

export async function register(req, res) {
  try {
    const { username, email, password, displayName, quickAccessConfigurations } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }

    const user = new User({ 
      username, 
      email, 
      password, 
      displayName, 
      quickAccessConfigurations 
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d' // Token expires in 7 days
    });

    res.status(201).json({ 
      user: user.toSafeObject(),
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    
    res.status(400).json({ 
      message: 'Error registering user', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ 
      user: user.toSafeObject(),
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ 
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.toSafeObject());
  } catch (error) {
    console.error('Get user error:', error);
    res.status(400).json({ 
      message: 'Error fetching user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function updateQuickAccessConfigurations(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { quickAccessConfigurations: req.body.quickAccessConfigurations },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ quickAccessConfigurations: user.quickAccessConfigurations });
  } catch (error) {
    console.error('Update quick access error:', error);
    res.status(400).json({ 
      message: 'Error updating quick access configurations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}