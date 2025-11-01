const User = require('../models/User');

// GET /api/users - Get list of users from MongoDB, hide password
const getUsers = async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    return res.status(200).json({
      message: 'Users retrieved successfully',
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Cannot retrieve users', detail: error.message });
  }
};

// POST /api/users - Add new user (for admin purposes)
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Please provide name and email.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    // Use default password if not provided
    const userPassword = password || '123456';

    const user = await User.create({
      name,
      email,
      password: userPassword,
      role: role === 'admin' ? 'admin' : 'user'
    });

    return res.status(201).json({
      message: 'User added successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Add user error:', error);
    return res.status(500).json({ message: 'Cannot add user', detail: error.message });
  }
};

module.exports = { getUsers, addUser };
