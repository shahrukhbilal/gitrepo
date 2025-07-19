const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

// ===============================
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
// ===============================
const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ msg: 'Order not found' });
  res.status(200).json({ msg: 'Order deleted successfully' });
};
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ msg: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Hide password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// ===============================
// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Admin
// ===============================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone') // populate these fields from User model
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


// ===============================
// @desc    Get all products
// @route   GET /api/admin/products
// @access  Admin
// ===============================
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// ===============================
// @desc    Delete a user by ID
// @route   DELETE /api/admin/users/:id
// @access  Admin
// ===============================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    const products = await Product.countDocuments();

    res.json({ users, orders, products });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard stats error' });
  }
};
module.exports = {
  getAllUsers,
  getAllOrders,
  getAllProducts,
  deleteUser,
  getDashboardStats,
 updateOrderStatus,
  deleteOrder,
};
