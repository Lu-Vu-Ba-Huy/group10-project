const express = require('express');
const { dangKy, dangNhap, dangXuat, getCurrentUser } = require('../controllers/authController');
const { xacThucToken } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', dangKy);
router.post('/register', dangKy); // Alias for signup
router.post('/login', dangNhap);
router.post('/logout', dangXuat);
router.get('/me', xacThucToken, getCurrentUser);

module.exports = router;

