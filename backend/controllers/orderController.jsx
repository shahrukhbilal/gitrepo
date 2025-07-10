// routes/orderController.js
const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
  try {
    const {
      fullName, email, phone,
      address, city, zip,
      paymentMethod, items, total
    } = req.body;
console.log("✅ Incoming Order Data:", req.body);

    const newOrder = await Order.create({
      fullName, email, phone,
      address, city, zip,
      paymentMethod, items, total
    });

    res.status(201).json({ message: 'Order created', order: newOrder });
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

module.exports = { createOrder };
