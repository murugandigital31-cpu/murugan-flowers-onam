const fs = require('fs');
const path = require('path');
const https = require('https');

const imageUrl = 'https://i.pinimg.com/originals/fa/1a/97/fa1a97d5f4e7fc274e0d507abd3b4a75.jpg';
const outputPath = path.join(__dirname, 'backend', 'uploads', 'placeholder-preview.jpg');

console.log(`Downloading placeholder image from ${imageUrl}`);
console.log(`Saving to ${outputPath}`);

https.get(imageUrl, (response) => {
  // Check if response is successful
  if (response.statusCode !== 200) {
    console.error(`Failed to download image: ${response.statusCode} ${response.statusMessage}`);
    return;
  }
  
  // Create write stream
  const file = fs.createWriteStream(outputPath);
  
  // Pipe the image data to the file
  response.pipe(file);
  
  // Handle completion
  file.on('finish', () => {
    file.close();
    console.log('Placeholder image downloaded successfully');
  });
  
  // Handle errors
  file.on('error', (err) => {
    fs.unlink(outputPath, () => {}); // Delete the file if there's an error
    console.error(`Error writing file: ${err.message}`);
  });
}).on('error', (err) => {
  console.error(`Error downloading image: ${err.message}`);
});