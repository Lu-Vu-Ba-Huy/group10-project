const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const xacThucToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token found. Please login.' });
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Changed from req.nguoiDung to req.user
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    return res.status(500).json({ message: 'Authentication error.', detail: error.message });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  return next();
};

module.exports = { xacThucToken, requireAdmin };


