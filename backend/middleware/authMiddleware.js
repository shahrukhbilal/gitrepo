// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains userId, email
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
