const User = require('../models/User');

/**
 * Admin Guard Middleware
 * Must be used AFTER the auth middleware.
 * Checks that the authenticated user has isAdmin = true.
 */
module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('isAdmin');
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ msg: 'Server Error' });
  }
};
