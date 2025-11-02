const User = require('../models/User');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');

// GET /api/profile - Get user profile
const xemProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      message: 'Profile retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Cannot retrieve profile', detail: error.message });
  }
};

// PUT /api/profile - Update user profile
const capNhatProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const updates = {};

    // Validate and update name
    if (name !== undefined) {
      if (!name.trim() || name.trim().length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters.' });
      }
      updates.name = name.trim();
    }

    // Validate and update email
    if (email !== undefined) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }

      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.user.id }
      });

      if (existingUser) {
        return res.status(409).json({ message: 'Email is already in use by another user.' });
      }

      updates.email = email.toLowerCase();
    }

    // Handle password change
    if (currentPassword && newPassword) {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Verify current password
      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters.' });
      }

      // Hash and update password
      updates.password = await bcrypt.hash(newPassword, 10);
    } else if (currentPassword || newPassword) {
      return res.status(400).json({ message: 'Both current password and new password are required to change password.' });
    }

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No information to update.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Cannot update profile', detail: error.message });
  }
};

// POST /api/profile/upload-avatar - Upload avatar to Cloudinary
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image to upload' });
    }

    // Upload image to Cloudinary using buffer
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
          transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Pipe file buffer to Cloudinary
      uploadStream.end(req.file.buffer);
    });

    // Update user avatar in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: uploadResult.secure_url },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log(`✅ Avatar uploaded to Cloudinary: ${uploadResult.secure_url}`);

    return res.status(200).json({
      message: 'Avatar updated successfully',
      avatarUrl: uploadResult.secure_url,
      user
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    return res.status(500).json({ 
      message: 'Cannot upload avatar', 
      detail: error.message 
    });
  }
};

module.exports = {
  xemProfile,
  capNhatProfile,
  uploadAvatar
};

