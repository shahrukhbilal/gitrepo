const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getAllOrders,
  getAllProducts,
  deleteUser,
  getDashboardStats,
  deleteOrder,
  updateOrderStatus,
  getSingleOrder
} = require('../controllers/adminController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All routes below are verifyTokened and for admin only
router.put('/orders/:id/status', verifyToken, isAdmin, updateOrderStatus);

// Route for single order by id 
router.get('/orders/:id', verifyToken, isAdmin, getSingleOrder);


// 🔐 Get all users
router.get('/users', verifyToken, isAdmin, getAllUsers);

// 🔐 Delete a user
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);

// 🔐 Get all orders
router.get('/orders', verifyToken, isAdmin, getAllOrders);

// 🔐 Delete orders by id 
router.delete('/orders/:id', verifyToken, isAdmin, deleteOrder);

// 🔐 update orders by id 
router.put('/orders/:id', verifyToken, isAdmin, deleteOrder);

// 🔐 Get all products
router.get('/products', verifyToken, isAdmin, getAllProducts);

router.get('/dashboard-stats', verifyToken, isAdmin, getDashboardStats);

router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json(req.admin); // If admin logged in
});
module.exports = router;
