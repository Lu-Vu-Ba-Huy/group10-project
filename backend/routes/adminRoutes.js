const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// 📍 GET /admin/users - Lấy danh sách tất cả users (chỉ Admin)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Lấy tất cả users, không bao gồm password
    const users = await User.find().select('-password');
    
    res.json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi lấy danh sách users',
      error: error.message 
    });
  }
});

// 📍 DELETE /admin/users/:id - Xóa user (chỉ Admin)
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra user tồn tại
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Không tìm thấy user' 
      });
    }

    // Không cho phép Admin tự xóa chính mình
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ 
        message: 'Không thể tự xóa tài khoản của chính mình!' 
      });
    }

    // Xóa user
    await User.findByIdAndDelete(id);

    res.json({
      message: 'Đã xóa user thành công',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi xóa user',
      error: error.message 
    });
  }
});

// 📍 PUT /admin/users/:id/role - Thay đổi role user (chỉ Admin)
router.put('/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ 
        message: 'Role không hợp lệ. Chỉ chấp nhận: user, admin' 
      });
    }

    // Tìm và cập nhật user
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Không tìm thấy user' 
      });
    }

    // Không cho phép thay đổi role của chính mình
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ 
        message: 'Không thể thay đổi role của chính mình!' 
      });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `Đã cập nhật role thành ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi cập nhật role',
      error: error.message 
    });
  }
});

module.exports = router;
