require('dotenv').config(); // Load .env trước
const cloudinary = require('cloudinary').v2;

// Cloudinary v2 tự động đọc CLOUDINARY_URL từ environment variables
// Format: cloudinary://api_key:api_secret@cloud_name

if (process.env.CLOUDINARY_URL) {
  console.log('✅ Cloudinary configured successfully');
} else {
  console.error('❌ CLOUDINARY_URL not found in .env');
}

module.exports = cloudinary;

