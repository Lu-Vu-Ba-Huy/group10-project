const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../services/emailService');

// Create token payload
const createTokenPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

// Generate JWT token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is missing in environment variables');
  }

  return jwt.sign(createTokenPayload(user), secret, { expiresIn: '24h' });
};

// POST /api/auth/signup - Register new user
const dangKy = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists. Please use another email.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user'
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Registration successful!',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Error during registration', detail: error.message });
  }
};

// POST /api/auth/login - Login user
const dangNhap = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: createTokenPayload(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error during login', detail: error.message });
  }
};

// POST /api/auth/logout - Logout user
const dangXuat = async (_req, res) => {
  return res.status(200).json({ message: 'Logout successful! Please remove token from your device.' });
};

// GET /api/auth/me - Get current user info
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User info retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ message: 'Error getting user info', detail: error.message });
  }
};

// POST /api/auth/forgot-password - Request password reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Không tiết lộ email có tồn tại hay không (bảo mật)
      return res.status(200).json({ 
        message: 'If that email exists, a password reset link has been sent.' 
      });
    }

    // Tạo token reset password (random 32 bytes)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token trước khi lưu vào database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Lưu token và thời gian hết hạn (15 phút)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Gửi email (giả lập - log ra console)
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.name);

    return res.status(200).json({
      message: 'Password reset instructions have been sent to your email.',
      // Trong development, trả về token để test
      resetToken,
      resetUrl: `http://localhost:3000/reset-password?token=${resetToken}`,
      emailPreview: emailResult.preview
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Error processing password reset', detail: error.message });
  }
};

// POST /api/auth/reset-password - Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash token từ request để so sánh với database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token. Please request a new password reset.' 
      });
    }

    // Đổi password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log(`✅ Password reset successfully for user: ${user.email}`);

    return res.status(200).json({
      message: 'Password has been reset successfully! You can now login with your new password.',
      success: true
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Error resetting password', detail: error.message });
  }
};

module.exports = {
  dangKy,
  dangNhap,
  dangXuat,
  getCurrentUser,
  forgotPassword,
  resetPassword
};

