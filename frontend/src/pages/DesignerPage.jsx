import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import config from '../config';
import '../styles/DesignerPage.css';

const DesignerPage = ({ setDesignResult }) => {
  const [designMethod, setDesignMethod] = useState(''); // 'upload' or 'guided'
  const [image, setImage] = useState(null);
  const [size, setSize] = useState(3);
  const [layers, setLayers] = useState(3);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFlowers, setSelectedFlowers] = useState({}); // Track selected flowers per color
  const [availableColors, setAvailableColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flowers, setFlowers] = useState([]);
  const [showFlowers, setShowFlowers] = useState(true); // For collapsible flowers section
  
  const navigate = useNavigate();
  
  // Color mapping for display
  const colorMapping = {
    'Yellow': '#FFEB3B',
    'Orange': '#FF9800',
    'Red': '#F44336',
    'Pink': '#E91E63',
    'Purple': '#9C27B0',
    'White': '#FFFFFF',
    'Green': '#4CAF50',
    'Blue': '#2196F3'
  };
  
  // Color to flower image mapping
  const colorToFlowerImageMap = {
    'Yellow': ['Marigold Yellow.webp', 'Yellow_Seventhi.avif', 'Naatu Seventhi.avif'],
    'Orange': ['Marigold_Orange.webp', 'Orange_rose.png'],
    'Red': ['red_rose.webp', 'Red Arali.png'],
    'Pink': ['Pink arali.webp', 'Penner rose.webp'],
    'Purple': ['Purple_seventhi.webp', 'Vaadamalli.png'],
    'White': ['White_seventhi.webp', 'Lilly.png'],
    'Green': ['Savukku.png']
  };
  
  // Flower display names for better UI
  const flowerDisplayNames = {
    'Marigold Yellow.webp': 'Marigold Yellow',
    'Yellow_Seventhi.avif': 'Yellow Seventhi',
    'Naatu Seventhi.avif': 'Naatu Seventhi',
    'Marigold_Orange.webp': 'Marigold Orange',
    'Orange_rose.png': 'Orange Rose',
    'red_rose.webp': 'Red Rose',
    'Red Arali.png': 'Red Arali',
    'Pink arali.webp': 'Pink Arali',
    'Penner rose.webp': 'Panneer Rose',
    'Purple_seventhi.webp': 'Purple Seventhi',
    'Vaadamalli.png': 'Vadamalli',
    'White_seventhi.webp': 'White Seventhi',
    'Lilly.png': 'White Lilly',
    'Savukku.png': 'Savukku'
  };
  
  // Base URL for flower images - using public folder
  const FLOWER_IMAGE_BASE_URL = '/images/flowers';
  
  // Fetch available flowers and colors
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        // Fetch from our API using the API utility
        const response = await API.get('/flowers');
        setFlowers(response);
        // Extract unique colors from the flower stock
        const colors = [...new Set(response.map(item => item.Color))];
        setAvailableColors(colors);
      } catch (err) {
        console.error('Error fetching flowers:', err);
        setError('Failed to load available flowers');
        
        // Fallback to static data if API fails
        const fallbackColors = ['Yellow', 'Orange', 'Red', 'Pink', 'Purple', 'White', 'Green', 'Blue'];
        setAvailableColors(fallbackColors);
        
        // Fallback flower data with AED currency
        setFlowers([
          { Flower: 'Marigold Yellow', Color: 'Yellow', 'PricePerKg': '120' },
          { Flower: 'Marigold Orange', Color: 'Orange', 'PricePerKg': '125' },
          { Flower: 'Rose Petals Red', Color: 'Red', 'PricePerKg': '190' },
          { Flower: 'Jasmine', Color: 'White', 'PricePerKg': '220' },
          { Flower: 'Chrysanthemum Purple', Color: 'Purple', 'PricePerKg': '140' },
          { Flower: 'Hibiscus', Color: 'Red', 'PricePerKg': '160' }
        ]);
      }
    };
    
    fetchFlowers();
    
    // Check if we're on mobile and set showFlowers to false by default
    const isMobile = window.innerWidth <= 768;
    setShowFlowers(!isMobile);
  }, []);
  
  // Initialize selected flowers when colors change
  useEffect(() => {
    const newSelectedFlowers = {};
    
    selectedColors.forEach(color => {
      if (colorToFlowerImageMap[color]) {
        // If we already have selected flowers for this color, keep them
        // Otherwise, default to selecting all flowers for this color
        if (!selectedFlowers[color] || selectedFlowers[color].length === 0) {
          newSelectedFlowers[color] = [...colorToFlowerImageMap[color]];
        } else {
          // Keep existing selections, but ensure they're still valid
          const validFlowers = selectedFlowers[color].filter(flower => 
            colorToFlowerImageMap[color].includes(flower)
          );
          
          // If no valid flowers left, select all
          newSelectedFlowers[color] = validFlowers.length > 0 
            ? validFlowers 
            : [...colorToFlowerImageMap[color]];
        }
      }
    });
    
    setSelectedFlowers(newSelectedFlowers);
  }, [selectedColors]);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setError('');
    }
  };
  
  const toggleColorSelection = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };
  
  const toggleFlowerSelection = (color, flowerImage) => {
    setSelectedFlowers(prev => {
      const updatedFlowers = { ...prev };
      
      if (!updatedFlowers[color]) {
        updatedFlowers[color] = [];
      }
      
      const isSelected = updatedFlowers[color].includes(flowerImage);
      
      if (isSelected) {
        // Remove flower if already selected
        updatedFlowers[color] = updatedFlowers[color].filter(f => f !== flowerImage);
        
        // Ensure at least one flower remains selected for each color
        if (updatedFlowers[color].length === 0) {
          // Revert to previous state if trying to deselect the last flower
          return prev;
        }
      } else {
        // Add flower if not already selected
        updatedFlowers[color] = [...updatedFlowers[color], flowerImage];
      }
      
      return updatedFlowers;
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let result;
      
      if (designMethod === 'upload' && image) {
        // Handle image upload method
        const formData = new FormData();
        formData.append('image', image);
        formData.append('size', size);
        formData.append('layers', layers);
        
        // Process the image with our API using the API utility
        try {
          console.log('Uploading image for analysis...');
          result = await API.postFormData('/process-image', formData);
          console.log('Successfully processed image:', result);
        } catch (apiError) {
          console.error('API Error:', apiError);
          throw new Error(`Failed to process image: ${apiError.message || apiError}`);
        }
      } else if (designMethod === 'guided') {
        // Handle guided builder method
        if (selectedColors.length === 0) {
          throw new Error('Please select at least one color');
        }
        
        // Convert the selected flowers map to a format suitable for the API
        const selectedFlowersArray = [];
        Object.entries(selectedFlowers).forEach(([color, flowerImages]) => {
          flowerImages.forEach(flowerImage => {
            selectedFlowersArray.push({
              color,
              flowerName: flowerDisplayNames[flowerImage] || flowerImage,
              imagePath: flowerImage
            });
          });
        });
        
        const requestData = {
          size: parseFloat(size),
          layers: parseInt(layers),
          colors: selectedColors,
          selectedFlowers: selectedFlowersArray
        };
        
        // Process the guided design with our API using the API utility
        try {
          console.log('Sending guided design request:', requestData);
          result = await API.post('/process-guided', requestData);
          console.log('Successfully processed guided design:', result);
        } catch (apiError) {
          console.error('API Error:', apiError);
          throw new Error(`Failed to process guided design: ${apiError.message || apiError}`);
        }
      } else {
        throw new Error('Please select a design method and provide required information');
      }
      
      setDesignResult(result);
      navigate('/result');
    } catch (err) {
      console.error('Error processing design:', err);
      setError(err.message || 'Failed to process design. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="designer-page">
      <div className="container">
        <h1 className="page-title text-center">Design Your Pookkolam</h1>
        <p className="page-subtitle text-center">Create beautiful traditional flower arrangements for Onam</p>
        
        {/* Available Flowers Preview - Collapsible on mobile */}
        <div className="available-flowers-section">
          <div className="section-header" onClick={() => setShowFlowers(!showFlowers)}>
            <h2 className="section-title">Available Flowers</h2>
            <div className="toggle-icon">{showFlowers ? '▲' : '▼'}</div>
          </div>
          {showFlowers && (
            <div className="flowers-preview">
              {flowers.map((flower, index) => (
                <div key={index} className="flower-preview-card">
                  <div className="flower-color-dot" style={{ 
                    backgroundColor: colorMapping[flower.Color] || '#CCCCCC'
                  }}></div>
                  <div className="flower-preview-info">
                    <span className="flower-name">{flower.Flower}</span>
                    <span className="flower-price">AED {flower.PricePerKg}/kg</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="design-options">
          <div 
            className={`option-card ${designMethod === 'upload' ? 'selected' : ''}`}
            onClick={() => setDesignMethod('upload')}
          >
            <div className="option-icon">📷</div>
            <h3 className="option-title">Upload Image</h3>
            <p>Upload a picture of a pookkolam design you like</p>
          </div>
          
          <div 
            className={`option-card ${designMethod === 'guided' ? 'selected' : ''}`}
            onClick={() => setDesignMethod('guided')}
          >
            <div className="option-icon">⚙️</div>
            <h3 className="option-title">Guided Builder</h3>
            <p>Build your design step-by-step with our guided tool</p>
          </div>
        </div>
        
        {designMethod && (
          <form className="form-section" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message mb-2">
                {error}
              </div>
            )}
            
            {designMethod === 'upload' ? (
              <>
                <h2 className="form-title">Upload Your Design</h2>
                <div className="form-group">
                  <label className="form-label">Upload Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="form-input"
                  />
                  {image && (
                    <p className="mt-1">Selected: {image.name}</p>
                  )}
                  <p className="form-help">Upload a clear image of a pookkolam design you'd like to recreate</p>
                </div>
              </>
            ) : (
              <>
                <h2 className="form-title">Guided Builder</h2>
                <div className="color-selector">
                  <label className="form-label">Select Colors:</label>
                  <div className="flex gap-1 flex-wrap">
                    {availableColors.map((color) => (
                      <div
                        key={color}
                        className={`color-option ${selectedColors.includes(color) ? 'selected' : ''}`}
                        style={{ backgroundColor: colorMapping[color] || '#CCCCCC' }}
                        onClick={() => toggleColorSelection(color)}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="mt-1">
                    Selected: {selectedColors.join(', ') || 'None'}
                  </div>
                  
                  {/* Show flower images for selected colors with selection capability */}
                  {selectedColors.length > 0 && (
                    <div className="selected-flowers-preview mt-2">
                      <h3>Selected Flower Types:</h3>
                      {selectedColors.map(color => (
                        <div key={color} className="selected-color-section">
                          <h4 className="selected-color-title">{color}</h4>
                          <div className="flower-images-grid">
                            {colorToFlowerImageMap[color] && colorToFlowerImageMap[color].map((flowerImage, index) => (
                              <div 
                                key={`${color}-${index}`} 
                                className={`flower-image-preview ${selectedFlowers[color] && selectedFlowers[color].includes(flowerImage) ? 'selected' : ''}`}
                                onClick={() => toggleFlowerSelection(color, flowerImage)}
                              >
                                <img 
                                  src={`${FLOWER_IMAGE_BASE_URL}/${flowerImage}`} 
                                  alt={`${color} flower example`}
                                  className="flower-preview-img"
                                  onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZsb3dlciBJbWFnZTwvdGV4dD48L3N2Zz4=';
                                  }}
                                />
                                <span className="flower-name-label">{flowerDisplayNames[flowerImage] || flowerImage}</span>
                                <div className="flower-selection-indicator">
                                  {selectedFlowers[color] && selectedFlowers[color].includes(flowerImage) ? '✓' : ''}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="form-help">Choose colors and specific flowers for your pookkolam design. Click on flower images to select or deselect them.</p>
                </div>
              </>
            )}
            
            <div className="input-group">
              <div className="input-half">
                <label className="form-label">Size (feet)</label>
                <select 
                  value={size} 
                  onChange={(e) => setSize(e.target.value)}
                  className="form-input"
                >
                  <option value={3}>3 ft</option>
                  <option value={4}>4 ft</option>
                  <option value={5}>5 ft</option>
                  <option value={6}>6 ft</option>
                  <option value={7}>7 ft</option>
                  <option value={8}>8 ft</option>
                  <option value={9}>9 ft</option>
                </select>
                <p className="form-help">Diameter of your pookkolam design</p>
              </div>
              
              <div className="input-half">
                <label className="form-label">Layers</label>
                <select 
                  value={layers} 
                  onChange={(e) => setLayers(e.target.value)}
                  className="form-input"
                >
                  <option value={3}>3 layers</option>
                  <option value={5}>5 layers</option>
                  <option value={7}>7 layers</option>
                  <option value={9}>9 layers</option>
                </select>
                <p className="form-help">Number of concentric layers in your design</p>
              </div>
            </div>
            
            <div className="text-center mt-3">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Create My Pookkolam'}
              </button>
            </div>
            
            <div className="pricing-info">
              <h3>How Pricing Works</h3>
              <p>Our system calculates the exact quantity of flowers needed based on your design specifications and current market rates. You'll receive a detailed shopping list with quantities and prices for each flower type.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DesignerPage;