// Simple API test function
export const testAPIConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('API Connection Test Result:', data);
    return { success: true, data };
  } catch (error) {
    console.error('API Connection Test Error:', error);
    return { success: false, error: error.message };
  }
};

// Test image processing API
export const testImageProcessing = async (imageFile, size = 3, layers = 3) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('size', size);
    formData.append('layers', layers);
    
    const response = await fetch('http://localhost:5000/api/process-image', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    console.log('Image Processing Test Result:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Image Processing Test Error:', error);
    return { success: false, error: error.message };
  }
};

// Test guided design API
export const testGuidedDesign = async (size = 3, layers = 3, colors = ['Yellow', 'Red']) => {
  try {
    const response = await fetch('http://localhost:5000/api/process-guided', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ size, layers, colors })
    });
    
    const data = await response.json();
    console.log('Guided Design Test Result:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Guided Design Test Error:', error);
    return { success: false, error: error.message };
  }
};