const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

module.exports = {
  dangKy,
  dangNhap,
  dangXuat,
  getCurrentUser
};

