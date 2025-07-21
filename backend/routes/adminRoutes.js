const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getAllProducts,
  getAllOrders,
  getSingleOrder,
  deleteOrder,
  deleteUser,
  updateOrderStatus,
  getDashboardStats,
} = require('../controllers/adminController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// ✅ USERS ROUTES
router.get('/users', verifyToken, isAdmin, getAllUsers);
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);

// ✅ PRODUCTS ROUTES
router.get('/products', verifyToken, isAdmin, getAllProducts);

// ✅ ORDERS ROUTES
router.get('/orders', verifyToken, isAdmin, getAllOrders);
router.get('/orders/:id', verifyToken, isAdmin, getSingleOrder);
router.delete('/orders/:id', verifyToken, isAdmin, deleteOrder);
router.put('/orders/:id/status', verifyToken, isAdmin, updateOrderStatus);

// ✅ DASHBOARD ROUTE
router.get('/stats', verifyToken, isAdmin, getDashboardStats);

module.exports = router;
