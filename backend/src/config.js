// Server configuration
export const serverConfig = {
  // Port for the server to listen on (use environment variable or fallback to 5000)
  port: process.env.PORT || 5000,
  
  // Environment mode (development or production)
  environment: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  cors: {
    // In development, allow the frontend to access the API
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-production-domain.com'] // Change to your actual domain in production
      : ['http://localhost:3000', 'http://localhost:3001'], // Frontend development server
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  
  // Static file serving configuration
  static: {
    // In production, serve the frontend build from the public directory
    enabled: process.env.NODE_ENV === 'production',
    directory: '../frontend/dist', // Path to your frontend build directory
  }
};

export default serverConfig;