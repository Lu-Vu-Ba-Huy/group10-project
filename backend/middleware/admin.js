const User = require('../models/user');

// Middleware kiểm tra quyền Admin
const adminMiddleware = async (req, res, next) => {
  try {
    // req.user.userId được set bởi authMiddleware
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Không tìm thấy user' 
      });
    }

    // Kiểm tra role
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Không có quyền truy cập. Chỉ Admin mới được phép!' 
      });
    }

    // Lưu thông tin user vào request để dùng sau
    req.userInfo = user;
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi kiểm tra quyền',
      error: error.message 
    });
  }
};

module.exports = adminMiddleware;
