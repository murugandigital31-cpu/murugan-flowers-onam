// Configuration for API URLs in different environments
const config = {
  // Development environment (local)
  development: {
    apiBaseUrl: 'http://localhost:5000/api',
  },
  // Production environment (live server)
  production: {
    apiBaseUrl: '/api', // Same-origin relative path when hosted together
    // If hosting on separate servers, use the full URL:
    // apiBaseUrl: 'https://your-backend-domain.com/api',
  }
};

// Determine current environment
const environment = process.env.NODE_ENV || 'development';

// Export the configuration for the current environment
export default config[environment];