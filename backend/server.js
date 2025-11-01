const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');

require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({ 
    message: 'API is running. Please use endpoints: /api/auth, /api/users, /api/profile, /api/admin',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (signup, login, logout, me)',
      users: '/api/users (get, add)',
      profile: '/api/profile (get, update, upload-avatar)',
      admin: '/api/admin (users management)'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));