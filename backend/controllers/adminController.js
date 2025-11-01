const User = require('../models/User');

// GET /api/admin/users - Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    
    return res.status(200).json({
      message: 'Users retrieved successfully',
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ message: 'Cannot retrieve users', detail: error.message });
  }
};

// DELETE /api/admin/users/:id - Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Cannot delete user', detail: error.message });
  }
};

// PUT /api/admin/users/:id/role - Change user role (admin only)
const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin".' });
    }

    // Prevent admin from changing their own role
    if (id === req.user.id) {
      return res.status(400).json({ message: 'You cannot change your own role.' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      message: `User role updated to ${role} successfully`,
      user
    });
  } catch (error) {
    console.error('Change user role error:', error);
    return res.status(500).json({ message: 'Cannot change user role', detail: error.message });
  }
};

// PUT /api/admin/users/:id - Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (!name.trim() || name.trim().length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters.' });
      }
      updates.name = name.trim();
    }

    if (email !== undefined) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }

      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: id }
      });

      if (existingUser) {
        return res.status(409).json({ message: 'Email is already in use.' });
      }

      updates.email = email.toLowerCase();
    }

    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role.' });
      }
      updates.role = role;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No information to update.' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Cannot update user', detail: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  changeUserRole,
  updateUser
};

