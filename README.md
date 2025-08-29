# Murugan Flowers – Onam Pookkolam Designer

## Overview
This application allows users to design traditional Onam pookkolam (flower rangoli) arrangements using AI-powered tools. Users can either upload an image of a design they like or use the guided builder to create a custom design.

## How to Run the Application

### Prerequisites
- Node.js installed
- Azure OpenAI API access (GPT-4 Vision and DALL-E 3)

### Starting the Application

1. **Start the backend server:**
   ```
   cd backend
   node src/server.js
   ```
   Or use the provided batch file:
   ```
   run-backend.bat
   ```

2. **Start the frontend server:**
   ```
   cd frontend
   npm run dev
   ```
   Or use the provided batch file:
   ```
   run-frontend.bat
   ```

3. **Start both servers at once:**
   ```
   start-all-fixed.bat
   ```

## Testing the Application

### API Connection Test
The homepage includes an API connection test button that verifies:
- Backend server is running
- API endpoints are accessible
- Flower stock data is available

### Design Methods

1. **Image Upload Method:**
   - Click "Upload Image" on the designer page
   - Select an image of a pookkolam design
   - Choose size and number of layers
   - Click "Create My Pookkolam"
   - The system will:
     * Analyze the image using Azure OpenAI GPT-4 Vision
     * Extract dominant colors
     * Map colors to available flowers
     * Calculate quantities and prices
     * Generate a preview image using Azure OpenAI DALL-E 3

2. **Guided Builder Method:**
   - Click "Guided Builder" on the designer page
   - Select colors for your design
   - Choose size and number of layers
   - Click "Create My Pookkolam"
   - The system will:
     * Map selected colors to available flowers
     * Calculate quantities and prices
     * Generate a preview image using Azure OpenAI DALL-E 3

## API Endpoints

### Health Check
- `GET /api/health` - Check if the backend is running

### Flower Stock
- `GET /api/flowers` - Get available flower stock data

### Image Processing
- `POST /api/process-image` - Process uploaded image and generate design

### Guided Design
- `POST /api/process-guided` - Process guided design request

## Troubleshooting

### Common Issues

1. **API Connection Failed:**
   - Ensure the backend server is running on port 5000
   - Check that the frontend is configured to connect to the correct backend URL
   - Verify Azure OpenAI API keys and endpoints in the backend .env file

2. **Image Upload Not Working:**
   - Ensure the image file is not too large
   - Check that the file format is supported (jpg, png, etc.)
   - Verify that the backend can access the uploaded files

3. **No Real Data Showing:**
   - Make sure the real API calls are not commented out in DesignerPage.jsx
   - Check the browser console for any JavaScript errors
   - Verify that the backend is properly processing requests

### Testing with Sample Data

If you want to test without Azure OpenAI integration, you can:
1. Uncomment the mock data sections in DesignerPage.jsx
2. Comment out the real API calls
3. Use the hardcoded sample responses for testing the UI

## File Structure

```
backend/
  src/
    server.js      - Main server file
    openai.js      - Azure OpenAI integration
    data/
      flower_stock.csv - Flower stock data
  uploads/         - Uploaded images
  .env             - Environment variables

frontend/
  src/
    App.jsx        - Main application component
    pages/
      HomePage.jsx   - Homepage
      DesignerPage.jsx - Design interface
      ResultPage.jsx - Results display
    components/
      Header.jsx     - Navigation header
      APITest.js     - API testing component
    styles/          - CSS files
```

## Environment Variables

The backend requires the following environment variables in `.env`:

```
# Server Configuration
PORT=5000

# Azure OpenAI GPT-4 Turbo with Vision
GPT4_VISION_ENDPOINT=your_gpt4_vision_endpoint
GPT4_VISION_API_KEY=your_gpt4_vision_api_key

# Azure OpenAI DALL-E 3
DALLE_ENDPOINT=your_dalle_endpoint
DALLE_API_KEY=your_dalle_api_key
```