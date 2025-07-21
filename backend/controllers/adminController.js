const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

const { sendShipmentEmail } = require('../utils/mailer'); // ✅ Ensure correct path

const updateOrderStatus = async (req, res) => {
  const { id: orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.orderStatus = status;
    await order.save();

    // ✅ Send shipment email only if status is 'Shipped' and email exists
    if (status === 'Shipped' && order.user?.email) {
      try {
        const info = await sendShipmentEmail(order.user.email, order.user.name, order._id);
        console.log("✅ Shipment email sent:", info.response);
      } catch (error) {
        console.error("❌ Email sending failed:", error.message);
      }
    }

    res.status(200).json({ msg: 'Status updated successfully' });
  } catch (err) {
    console.error("❌ Order status update error:", err.message);
    res.status(500).json({ msg: 'Error updating order status', error: err.message });
  }
};

// ✅ Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users', error: err.message });
  }
};

// ✅ Delete a user by ID
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting user', error: err.message });
  }
};

// ✅ Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching products', error: err.message });
  }
};

// ✅ Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching orders', error: err.message });
  }
};

// ✅ Get single order
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ✅ Delete an order
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ✅ Update order status

// ✅ Dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalProducts,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching dashboard stats', error: err.message });
  }
};

// ✅ EXPORT ALL CONTROLLERS
module.exports = {
  getAllUsers,
  getAllProducts,
  getAllOrders,
  getSingleOrder,
  deleteOrder,
  deleteUser,
  updateOrderStatus,
  getDashboardStats,
};
