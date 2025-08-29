# Onam Pookkolam Designer Backend

This is the backend server for the Onam Pookkolam Designer application.

## Setup

1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```

2. Update the `.env` file with your Azure OpenAI API credentials:
   ```
   GPT4_VISION_ENDPOINT=your-gpt4-vision-endpoint
   GPT4_VISION_API_KEY=your-gpt4-vision-api-key
   DALLE_ENDPOINT=your-dalle-endpoint
   DALLE_API_KEY=your-dalle-api-key
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

- `GET /api/health`: Health check endpoint
- `GET /api/flowers`: Get available flower stock
- `POST /api/process-image`: Process uploaded image and generate design
- `POST /api/process-guided`: Process guided design request

## Environment Variables

Required environment variables:
- `PORT`: Server port (default: 5000)
- `GPT4_VISION_ENDPOINT`: Azure OpenAI GPT-4 Vision API endpoint
- `GPT4_VISION_API_KEY`: Azure OpenAI GPT-4 Vision API key
- `DALLE_ENDPOINT`: Azure OpenAI DALL-E 3 API endpoint
- `DALLE_API_KEY`: Azure OpenAI DALL-E 3 API key