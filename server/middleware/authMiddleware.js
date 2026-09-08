const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectAdmin = async (req, res, next) => {
  try {
    let token = req.cookies.admin_token;

    // Fallback check authorization header if provided
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_jaseel_2026_dev_secure');
    const user = await User.findById(decoded.id).select('-password');

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }
};

module.exports = { protectAdmin };
