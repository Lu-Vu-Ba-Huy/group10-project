const multer = require('multer');

// Cấu hình multer để lưu file trong memory (RAM)
const storage = multer.memoryStorage();

// File filter - chỉ chấp nhận ảnh
const fileFilter = (req, file, cb) => {
  // Kiểm tra MIME type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)'), false);
  }
};

// Cấu hình upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;

