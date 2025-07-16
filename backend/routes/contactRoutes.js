// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel'); // Make sure model is imported

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newContact = new Contact({ name, email, message }); // ✅ Create instance
    const savedContact = await newContact.save();              // ✅ Then save

    res.status(201).json({ message: 'Message sent successfully', data: savedContact });
  } catch (error) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
