const express = require('express');
const router = express.Router();
const User= require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const user = await User.create({ name, email, password });
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(201).json({
    token,
    user: { name: user.name, email: user.email }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u || !(await u.compare(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: u._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { email: u.email } });
});

module.exports = router;
