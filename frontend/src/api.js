import config from './config';

// API utility functions
const API = {
  /**
   * Make a GET request to the API
   * @param {string} endpoint - The API endpoint (without the base URL)
   * @returns {Promise} - The fetch promise
   */
  get: async (endpoint) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  /**
   * Make a POST request to the API
   * @param {string} endpoint - The API endpoint (without the base URL)
   * @param {object} data - The data to send in the request body
   * @returns {Promise} - The fetch promise
   */
  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  /**
   * Make a POST request with FormData (for file uploads)
   * @param {string} endpoint - The API endpoint (without the base URL)
   * @param {FormData} formData - The FormData object
   * @returns {Promise} - The fetch promise
   */
  postFormData: async (endpoint, formData) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};

export default API;