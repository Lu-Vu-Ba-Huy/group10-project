const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Hàm tạo JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// POST /auth/register - Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Vui lòng điền đầy đủ thông tin!' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Mật khẩu phải có ít nhất 6 ký tự!' 
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email này đã được đăng ký!' 
      });
    }

    // Tạo user mới
    const user = new User({
      name,
      email,
      password // Password sẽ được hash tự động bởi pre-save hook
    });

    await user.save();

    // Tạo token
    const token = generateToken(user._id);

    // Trả về thông tin user (không có password)
    res.status(201).json({
      message: 'Đăng ký thành công!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi đăng ký!',
      error: error.message 
    });
  }
});

// POST /auth/login - Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập email và mật khẩu!' 
      });
    }

    // Tìm user (bao gồm password vì mặc định select: false)
    const user = await User.findOne({ email }).select('+password');
    console.log('👤 User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ 
        message: 'Email hoặc mật khẩu không đúng!' 
      });
    }

    // So sánh password
    console.log('🔍 Comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('✅ Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({ 
        message: 'Email hoặc mật khẩu không đúng!' 
      });
    }

    // Tạo token
    const token = generateToken(user._id);
    console.log('🎫 Token generated successfully');

    // Trả về thông tin user
    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    console.log('✅ Login successful for:', user.email);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi đăng nhập!',
      error: error.message 
    });
  }
});

// GET /auth/me - Lấy thông tin user hiện tại (cần token)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Không có token xác thực!' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Không tìm thấy user!' 
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ 
      message: 'Token không hợp lệ!' 
    });
  }
});

// POST /auth/forgot-password - Quên mật khẩu (tạo token reset)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('🔐 Forgot password request for:', email);

    // Validate input
    if (!email) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập email!' 
      });
    }

    // Tìm user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({ 
        message: 'Không tìm thấy tài khoản với email này!' 
      });
    }

    // Tạo reset token (random string 32 bytes)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token trước khi lưu vào DB (để bảo mật)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Lưu token vào user (expires sau 15 phút)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 phút
    
    await user.save();

    console.log('✅ Reset token created for:', email);
    console.log('🎫 Token (plain):', resetToken);

    // Trong production, token sẽ được gửi qua email
    // Nhưng trong development, trả về token luôn
    res.json({
      message: 'Token reset password đã được tạo!',
      token: resetToken,
      expiresIn: '15 phút',
      // Trong production xóa dòng dưới đi
      note: 'Trong production, token sẽ được gửi qua email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi xử lý quên mật khẩu!',
      error: error.message 
    });
  }
});

// POST /auth/reset-password - Đặt lại mật khẩu
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log('🔐 Reset password attempt');

    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập token và mật khẩu mới!' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' 
      });
    }

    // Hash token để so sánh với DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('❌ Invalid or expired token');
      return res.status(400).json({ 
        message: 'Token không hợp lệ hoặc đã hết hạn!' 
      });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword; // Sẽ được hash tự động bởi pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    res.json({
      message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi đặt lại mật khẩu!',
      error: error.message 
    });
  }
});

module.exports = router;
