const express = require('express');
const router = express.Router();

router.post('/',async (req, res)=>{
    const{name, email, subject, message}= req.body;
    if(!name || !email || !subject || !message){
        return res.status(400).json({message:"Name,Email, Subject, Message are required"})
    }
    try {
    // You can save this to the database or send an email
    console.log('New Contact Form Submission:', { name, email, subject, message });
    
    // For demo: pretend saving to DB or sending email
    return res.status(200).json({ message: 'Message received successfully!' });
  } catch (err) {
    console.error('Error handling contact form:', err);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});
module.exports= router;