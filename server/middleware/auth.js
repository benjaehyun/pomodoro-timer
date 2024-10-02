const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('Authentication failed: No token provided');
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication failed: Invalid token', error);
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};