const express = require('express');
const { getAllUsers, deleteUser, changeUserRole, updateUser } = require('../controllers/adminController');
const { xacThucToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(xacThucToken);
router.use(requireAdmin);

// Admin routes
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', changeUserRole);
router.put('/users/:id', updateUser);

module.exports = router;

