# Onam Pookkolam Designer Frontend

This is the frontend application for the Onam Pookkolam Designer, a web application for designing traditional flower arrangements for Onam festival.

## Features

- Browse available flowers with color filtering
- Design pookkolams using guided builder interface
- Upload images for AI-based color extraction
- View generated preview images
- Calculate flower quantities and pricing
- Shopping cart with WhatsApp checkout

## Setup Instructions

1. Clone this repository:
   ```
   git clone https://github.com/murugandigital31-cpu/onam-pookkolam-frontend.git
   cd onam-pookkolam-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the API base URL in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

5. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:3000

## Building for Production

```
npm run build
```

This will create a `dist` folder with optimized production build.

## Dependencies

- React
- React Router
- Axios
- Vite

## Connection to Backend

This frontend connects to the [Onam Pookkolam Backend](https://github.com/murugandigital31-cpu/onam-pookkolam-backend) for API services. Make sure the backend server is running on the configured URL.