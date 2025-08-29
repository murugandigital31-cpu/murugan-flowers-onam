// Simple test to verify API connectivity
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('API Test Result:', data);
    return data;
  } catch (error) {
    console.error('API Test Error:', error);
    return { error: error.message };
  }
};

export default testAPI;