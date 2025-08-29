// Configuration for API URLs in different environments
const config = {
  // Development environment (local)
  development: {
    apiBaseUrl: 'http://localhost:5000/api',
  },
  // Production environment (live server)
  production: {
    // For separate deployments, use the full URL to the backend
    apiBaseUrl: 'https://your-backend-domain.com/api',
    // When deploying, update this to the actual backend URL
  }
};

// Determine current environment
const environment = process.env.NODE_ENV || 'development';

// Export the configuration for the current environment
export default config[environment];