const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Extracts and verifies a Bearer token from the Authorization header.
 * On success, attaches `req.user` = { id, role }.
 */
module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Support "Bearer <token>" format
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
