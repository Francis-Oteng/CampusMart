const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies the Bearer token and attaches user payload to req.user
 */
module.exports = function (req, res, next) {
  const header = req.header('Authorization');
  if (!header) {
    return res.status(401).json({ msg: 'No token — authorisation denied' });
  }

  // Support "Bearer <token>" format
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;          // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is invalid or expired' });
  }
};
