export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // This will route to Vercel serverless functions
  : process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";