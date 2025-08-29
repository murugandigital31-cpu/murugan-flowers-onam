# Placeholder Image Requirements

For the application to work correctly in development mode, you need to add a placeholder image at this location:

```
d:\Web_App\Onam\backend\uploads\placeholder-preview.jpg
```

This image should be:
- A high-quality image of a traditional pookkolam design
- Resolution of at least 1024x1024 pixels
- JPG format
- Named exactly "placeholder-preview.jpg"

You can download a suitable pookkolam image from the internet or use one from your collection.

## Why this is needed

The application uses this image when:
1. The Azure OpenAI DALL-E API is not available
2. When running in development mode
3. When there's an error generating a custom image

Having a good quality placeholder ensures the application looks professional even when running in development mode.