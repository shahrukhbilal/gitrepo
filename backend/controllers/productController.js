const Product = require('../models/productModel');
const FeaturedCategory = require('../models/featuredCategoryModel');
// Create product
const createProduct = async (req, res) => {
  try {
    const { name, slug, description, image, price, stock, category } = req.body;
    const product = await Product.create({ name, slug, description, image, price, stock, category });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Failed to create product' });
  }
};


// Get all products with optional filtering and sorting
const getAllProducts = async (req, res) => {
  try {
    const { category, min, max, sort } = req.query;

    const filter = {};

    // 🟨 Log the incoming query
    console.log('🔍 Incoming query params:', req.query);

    // Convert category slug to ID
    if (category) {
      const categoryDoc = await FeaturedCategory.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        console.log('❌ No category matched for slug:', category);
        return res.status(200).json([]);
      }
    }

    if (min || max) filter.price = {};
    if (min) filter.price.$gte = Number(min);
    if (max) filter.price.$lte = Number(max);

    // 🧱 Log the final filter object
    console.log('🧱 Final MongoDB filter:', filter);

    let query = Product.find(filter);

    if (sort === 'low') query = query.sort({ price: 1 });
    else if (sort === 'high') query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query.populate('category', 'name slug'); // Optional

    res.status(200).json(products);
  } catch (error) {
    console.error('❌ Error fetching filtered products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('❌ Error fetching product by slug:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductBySlug, 
};