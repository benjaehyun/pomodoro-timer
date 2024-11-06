import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    console.log('Authentication failed: No token provided');
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Enhance the user object with additional info if needed
    req.user = {
      ...decoded,
      userId: decoded.userId || decoded._id // Handle different token formats
    };
    
    next();
  } catch (error) {
    console.error('Authentication failed: Invalid token', error);
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
}