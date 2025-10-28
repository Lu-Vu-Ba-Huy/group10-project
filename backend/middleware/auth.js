const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Không có token xác thực. Vui lòng đăng nhập!' 
      });
    }

    // Lấy token (bỏ "Bearer ")
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Gắn user info vào request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại!' 
      });
    }
    return res.status(401).json({ 
      message: 'Token không hợp lệ!' 
    });
  }
};

module.exports = authMiddleware;
