const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getAllOrders,
  getAllProducts,
  deleteUser,
} = require('../controllers/adminController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All routes below are verifyTokened and for admin only

// 🔐 Get all users
router.get('/users', verifyToken, isAdmin, getAllUsers);

// 🔐 Delete a user
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);

// 🔐 Get all orders
router.get('/orders', verifyToken, isAdmin, getAllOrders);

// 🔐 Get all products
router.get('/products', verifyToken, isAdmin, getAllProducts);

module.exports = router;
