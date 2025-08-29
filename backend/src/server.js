import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeImageWithGPT, generateImageWithDalle } from './openai.js';
import serverConfig from './config.js';

// Fix for ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = serverConfig.port;

// Middleware
app.use(cors({
  origin: serverConfig.cors.origin,
  methods: serverConfig.cors.methods,
  allowedHeaders: serverConfig.cors.allowedHeaders
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/Flowers', express.static(path.join(__dirname, '..', '..', 'Flowers')));
app.use('/bg_onam', express.static(path.join(__dirname, '..', '..', 'bg_onam')));
app.use('/Onam/bg_onam', express.static(path.join(__dirname, '..', '..', 'bg_onam'))); // Add direct path to support new image URLs

// Serve frontend in production
if (serverConfig.static.enabled) {
  const frontendPath = path.join(__dirname, '..', serverConfig.static.directory);
  console.log(`Serving frontend from: ${frontendPath}`);
  app.use(express.static(frontendPath));
}

// Add upload directory if it doesn't exist
const uploadDirPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDirPath)) {
  fs.mkdirSync(uploadDirPath, { recursive: true });
}

// Add placeholder image if it doesn't exist
const placeholderPath = path.join(uploadDirPath, 'placeholder-preview.jpg');
if (!fs.existsSync(placeholderPath)) {
  // You would typically copy a placeholder image here
  // For now we'll just log it
  console.log('Placeholder image not found at:', placeholderPath);
  console.log('A placeholder image should be added manually to:', placeholderPath);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the uploads directory we created earlier
    cb(null, uploadDirPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Read flower stock data from CSV
const readFlowerStock = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stockFilePath = path.join(__dirname, '..', 'data', 'flower_stock.csv');
    
    if (!fs.existsSync(stockFilePath)) {
      // Create a default stock file if it doesn't exist
      const defaultStock = [
        ['Flower', 'Color', 'Available As', 'PricePerKg'],
        ['Marigold Yellow', 'Yellow', 'Loose', '250'],
        ['Marigold Orange', 'Orange', 'Loose', '260'],
        ['Rose Petals', 'Red', 'Petals', '400'],
        ['Jasmine', 'White', 'Loose', '500'],
        ['Chrysanthemum Purple', 'Purple', 'Loose', '300'],
        ['Carnation Pink', 'Pink', 'Loose', '450'],
        ['Leaves Green', 'Green', 'Loose', '100']
      ];
      
      const csvContent = defaultStock.map(row => row.join(',')).join('\n');
      fs.writeFileSync(stockFilePath, csvContent);
    }
    
    fs.createReadStream(stockFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Calculate flower quantities and prices
const calculateFlowerQuantities = (size, layers, colors, stockData) => {
  const totalQty = size * layers * 0.5; // Total quantity in kg
  const qtyPerColor = totalQty / colors.length;
  
  const flowerList = colors.map(color => {
    // Find all matching flowers for this color in stock
    const matchingFlowers = stockData.filter(item => item.Color.toLowerCase() === color.toLowerCase());
    
    if (matchingFlowers.length > 0) {
      // Use the first matching flower (we could add logic to choose different flowers later)
      const flower = matchingFlowers[0];
      const qty = qtyPerColor;
      // Ensure we're using the exact price from the CSV file
      const price = Math.round(qty * parseFloat(flower.PricePerKg));
      return {
        flower: flower.Flower,
        qty: qty.toFixed(1) + ' kg',
        price: 'AED ' + price,
        pricePerKg: flower.PricePerKg // Store the per kg price for reference
      };
    }
    
    // If no exact match, find closest color
    return {
      flower: 'Mixed ' + color + ' flowers',
      qty: qtyPerColor.toFixed(1) + ' kg',
      price: 'AED ' + Math.round(qtyPerColor * 150), // Default price
      pricePerKg: '150' // Default price per kg
    };
  });
  
  const totalPrice = flowerList.reduce((sum, item) => {
    return sum + parseInt(item.price.replace('AED ', ''));
  }, 0);
  
  return {
    flowerList,
    totalPrice: 'AED ' + totalPrice
  };
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pookkolam Designer API is running' });
});

// Get flower stock
app.get('/api/flowers', async (req, res) => {
  try {
    const stockData = await readFlowerStock();
    res.json(stockData);
  } catch (error) {
    console.error('Error reading flower stock:', error);
    res.status(500).json({ error: 'Failed to read flower stock' });
  }
});

// Process uploaded image
app.post('/api/process-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const { size, layers } = req.body;
    const stockData = await readFlowerStock();
    
    // Create an image URL that can be accessed by GPT-4 Vision
    const imageUrl = `http://${req.get('host')}/uploads/${req.file.filename}`;
    const uploadedImageUrl = `/uploads/${req.file.filename}`; // Relative URL for frontend
    console.log(`Image URL for GPT-4 Vision: ${imageUrl}`);
    
    let parsedResult;
    let previewImage = '/placeholder-preview.jpg'; // Default fallback
    let designReview = '';
    
    try {
      // Send the image to GPT-4 Vision for color analysis
      const gptAnalysisResult = await analyzeImageWithGPT(imageUrl, stockData, size, layers);
      console.log('GPT Analysis Result:', gptAnalysisResult);
      
      // Parse the GPT-4 Vision response
      try {
        // Try to find and parse any JSON object in the response
        const jsonMatch = gptAnalysisResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON found, try to extract key information from the text
          const colorsMatch = gptAnalysisResult.match(/colors[_\s]detected[:\s]+(.*?)(?=[\n\r]|$)/i);
          const colors = colorsMatch ? colorsMatch[1].split(/[,\s]+/).filter(Boolean) : ['Yellow', 'Red', 'White'];
          
          parsedResult = {
            colors_detected: colors
          };
        }
        
        // Generate a design review based on the detected colors
        designReview = `This beautiful pookkolam design features ${parsedResult.colors_detected.length} main colors: ${parsedResult.colors_detected.join(', ')}. 
        The arrangement creates a vibrant and traditional pattern ideal for Onam celebrations. 
        The symmetrical design with ${layers} concentric layers creates a balanced and visually appealing rangoli that would be approximately ${size} feet in diameter when created with real flowers.`;
        
      } catch (parseError) {
        console.error('Error parsing GPT response:', parseError);
        // Fallback to default colors
        parsedResult = {
          colors_detected: ['Yellow', 'Red', 'White']
        };
      }
      
      try {
        // Generate preview image with DALL-E, passing color-to-flower mapping
        previewImage = await generateImageWithDalle(size, layers, parsedResult.colors_detected, colorToFlowerImageMap);
      } catch (dalleError) {
        console.error('Error generating DALL-E image:', dalleError);
        // Keep using the default previewImage
      }
    } catch (apiError) {
      console.error('API Error:', apiError);
      // If API fails, use fallback default values
      parsedResult = {
        colors_detected: ['Orange', 'Yellow', 'Red']
      };
      designReview = `This pookkolam design appears to feature traditional colors commonly used in Onam celebrations. 
      The pattern creates a beautiful arrangement with approximately ${layers} layers and would be about ${size} feet in diameter when created with real flowers.`;
    }
    
    // Calculate quantities and prices using either API results or fallback values
    const result = calculateFlowerQuantities(
      parseFloat(size), 
      parseInt(layers), 
      parsedResult.colors_detected, 
      stockData
    );
    
    // Send response with available data
    res.json({
      colors_detected: parsedResult.colors_detected,
      mapped_flowers: result.flowerList,
      total_price: result.totalPrice,
      preview_image: previewImage,
      uploaded_image: uploadedImageUrl,
      design_review: designReview
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image: ' + error.message });
  }
});

// Process guided builder request
app.post('/api/process-guided', async (req, res) => {
  try {
    const { size, layers, colors, selectedFlowers } = req.body;
    
    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return res.status(400).json({ error: 'Please select at least one color' });
    }
    
    const stockData = await readFlowerStock();
    const result = calculateFlowerQuantities(
      parseFloat(size) || 3, // Default to 3 if parsing fails
      parseInt(layers) || 3, // Default to 3 if parsing fails
      colors, 
      stockData
    );
    
    // Generate preview image with DALL-E, using selected flowers if available
    let previewImage = '/placeholder-preview.jpg'; // Default fallback
    
    // Create a color-to-flower mapping based on selected flowers
    let colorToFlowerMapForDalle = {};
    
    // If selectedFlowers data is provided, use it to create a more accurate mapping
    if (selectedFlowers && Array.isArray(selectedFlowers) && selectedFlowers.length > 0) {
      // Group selected flowers by color
      const flowersByColor = {};
      selectedFlowers.forEach(flower => {
        if (!flowersByColor[flower.color]) {
          flowersByColor[flower.color] = [];
        }
        flowersByColor[flower.color].push(flower.imagePath);
      });
      
      // Use the selected flowers for the mapping
      colorToFlowerMapForDalle = flowersByColor;
    } else {
      // Fall back to the default color-to-flower mapping
      colorToFlowerMapForDalle = colorToFlowerImageMap;
    }
    
    try {
      previewImage = await generateImageWithDalle(size, layers, colors, colorToFlowerMapForDalle);
    } catch (dalleError) {
      console.error('Error generating DALL-E image:', dalleError);
      // Keep using the default previewImage
    }
    
    // Generate a design review based on the selected colors
    const designReview = `This custom pookkolam design features ${colors.length} main colors: ${colors.join(', ')}. 
    The arrangement creates a vibrant and traditional pattern ideal for Onam celebrations. 
    The design with ${layers} concentric layers will be approximately ${size} feet in diameter when created with real flowers.
    The color combination you've selected represents ${colors.includes('Yellow') ? 'prosperity, ' : ''}${colors.includes('Red') ? 'energy, ' : ''}${colors.includes('Orange') ? 'enthusiasm, ' : ''}${colors.includes('Green') ? 'growth, ' : ''}${colors.includes('White') ? 'purity, ' : ''}${colors.includes('Purple') ? 'creativity, ' : ''}${colors.includes('Pink') ? 'love, ' : ''} making this design perfect for your Onam celebration.`;
    
    res.json({
      colors_detected: colors,
      flowerList: result.flowerList,
      totalPrice: result.totalPrice,
      preview_image: previewImage,
      design_review: designReview
    });
  } catch (error) {
    console.error('Error processing guided request:', error);
    res.status(500).json({ error: 'Failed to process guided request: ' + error.message });
  }
});

// Create data directory and sample CSV if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  
  // Create sample CSV file
  const sampleData = `Flower,Color,Available As,PricePerKg
Marigold Yellow,Yellow,Loose,120
Marigold Orange,Orange,Loose,125
Rose Petals,Red,Petals,190
Jasmine,White,Loose,220
Chrysanthemum Purple,Purple,Loose,140
Carnation Pink,Pink,Loose,200
Leaves Green,Green,Loose,50`;
  
  fs.writeFileSync(path.join(dataDir, 'flower_stock.csv'), sampleData);
}

const server = app.listen(PORT, () => {
  console.log(`Pookkolam Designer backend running at http://localhost:${PORT}`);
  console.log(`Health endpoint available at http://localhost:${PORT}/api/health`);
  console.log(`Environment: ${serverConfig.environment}`);
  if (serverConfig.static.enabled) {
    console.log(`Serving frontend in production mode`);
  }
});

// Color to flower image mapping for accurate image generation
const colorToFlowerImageMap = {
  'Yellow': ['Marigold Yellow.webp', 'Yellow_Seventhi.avif', 'Naatu Seventhi.avif'],
  'Orange': ['Marigold_Orange.webp', 'Orange_rose.png'],
  'Red': ['red_rose.webp', 'Red Arali.png'],
  'Pink': ['Pink arali.webp', 'Penner rose.webp'],
  'Purple': ['Purple_seventhi.webp', 'Vaadamalli.png'],
  'White': ['White_seventhi.webp', 'Lilly.png'],
  'Green': ['Savukku.png']
};

// For production, serve the React app for any unmatched routes
if (serverConfig.static.enabled) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', serverConfig.static.directory, 'index.html'));
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server shut down successfully');
    process.exit(0);
  });
});