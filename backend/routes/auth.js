const express = require('express');
const { 
  dangKy, 
  dangNhap, 
  dangXuat, 
  getCurrentUser,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { xacThucToken } = require('../middleware/auth');

const router = express.Router();

// Authentication routes
router.post('/signup', dangKy);
router.post('/register', dangKy); // Alias for signup
router.post('/login', dangNhap);
router.post('/logout', dangXuat);
router.get('/me', xacThucToken, getCurrentUser);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;

