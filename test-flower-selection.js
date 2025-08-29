// Test file to verify flower selection functionality
const axios = require('axios');

async function testGuidedBuilder() {
  try {
    const response = await axios.post('http://localhost:5000/api/process-guided', {
      size: 4,
      layers: 3,
      colors: ['Yellow', 'Red'],
      selectedFlowers: [
        {
          color: 'Yellow',
          flowerName: 'Marigold Yellow',
          imagePath: 'Marigold Yellow.webp'
        },
        {
          color: 'Red',
          flowerName: 'Red Rose',
          imagePath: 'red_rose.webp'
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
    }
  }
}

testGuidedBuilder();