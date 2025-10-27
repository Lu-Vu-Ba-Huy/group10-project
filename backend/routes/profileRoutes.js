const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/avatars';
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique: userId_timestamp.ext
    const uniqueName = `${req.user.userId}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF)'));
    }
  }
});

// 📍 GET /profile - Lấy thông tin profile của user hiện tại
router.get('/', authMiddleware, async (req, res) => {
  try {
    // req.user.userId được set bởi authMiddleware
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Không tìm thấy user' 
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar ? `http://localhost:3000${user.avatar}` : '',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi lấy thông tin profile',
      error: error.message 
    });
  }
});

// 📍 PUT /profile - Cập nhật thông tin profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    // Tìm user
    const user = await User.findById(req.user.userId).select('+password');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Không tìm thấy user' 
      });
    }

    // Nếu muốn đổi password, phải nhập currentPassword
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ 
          message: 'Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới' 
        });
      }

      // Kiểm tra currentPassword có đúng không
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          message: 'Mật khẩu hiện tại không đúng' 
        });
      }

      // Kiểm tra độ dài password mới
      if (newPassword.length < 6) {
        return res.status(400).json({ 
          message: 'Mật khẩu mới phải có ít nhất 6 ký tự' 
        });
      }

      user.password = newPassword; // Sẽ tự động hash bởi pre-save hook
    }

    // Cập nhật name nếu có
    if (name && name.trim()) {
      user.name = name.trim();
    }

    // Cập nhật email nếu có và khác email hiện tại
    if (email && email !== user.email) {
      // Kiểm tra email mới đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ 
          message: 'Email này đã được sử dụng bởi user khác' 
        });
      }
      user.email = email;
    }

    // Lưu thay đổi
    await user.save();

    res.json({
      message: 'Cập nhật thông tin thành công',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Xử lý lỗi validation từ mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Dữ liệu không hợp lệ',
        error: error.message 
      });
    }

    res.status(500).json({ 
      message: 'Lỗi server khi cập nhật profile',
      error: error.message 
    });
  }
});

// 📍 POST /profile/upload-avatar - Upload avatar
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
    }

    // Lấy URL của file (relative path)
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Cập nhật avatar vào database
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Xóa avatar cũ nếu có
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    user.avatar = avatarUrl;
    await user.save();

    res.json({
      message: 'Upload avatar thành công',
      avatarUrl: `http://localhost:3000${avatarUrl}`
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi upload avatar',
      error: error.message 
    });
  }
});

module.exports = router;
