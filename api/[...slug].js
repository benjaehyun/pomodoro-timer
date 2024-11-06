import app from './index';

export default async function handler(req, res) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Modify the URL to match your Express routes
    // Remove /api prefix as it's already in your routes
    req.url = req.url.replace(/^\/api/, '');
    
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}