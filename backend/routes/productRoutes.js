const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductBySlug } = require('../controllers/productController');

router.post('/', createProduct);         // POST /api/products
router.get('/', getAllProducts);         // GET /api/products
router.get('/:slug', getProductBySlug)    // GET/api/products/:slug 
module.exports = router;
