// middleware/authMiddleware.js
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Attach user object (without password) to request
    req.user = await User.findById(decoded.id).select('-password')
    
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' })
    }

    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Access denied: Admin only' })
  }
}

module.exports = { verifyToken, isAdmin }
