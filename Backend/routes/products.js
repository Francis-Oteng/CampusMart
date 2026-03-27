const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Product = require('../models/Product');
const User = require('../models/User');

// @route   GET /api/products
// @desc    Get all products (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, seller, sort, limit, page } = req.query;
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by search term
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { sellerName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter featured products
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by seller
    if (seller === 'me') {
      // Requires auth — handled below
    } else if (seller) {
      query.seller = seller;
    }

    // Only show active products for public queries (unless seller is viewing their own)
    if (!seller) {
      query.status = 'active';
    }

    // Build sort
    let sortObj = { createdAt: -1 }; // Default: newest first
    if (sort === 'price-low') sortObj = { price: 1 };
    else if (sort === 'price-high') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };

    // Pagination
    const perPage = parseInt(limit) || 20;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * perPage;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(perPage)
      .populate('seller', 'name storeName');

    res.json({
      products,
      total,
      page: currentPage,
      pages: Math.ceil(total / perPage)
    });
  } catch (err) {
    console.error('Get products error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET /api/products/mine
// @desc    Get current seller's products
// @access  Private
router.get('/mine', auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    console.error('Get my products error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name storeName campus');
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Get product error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private (seller/both)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, category, price, stock, badge, color } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ msg: 'Name, category, and price are required' });
    }

    // Get seller name
    const seller = await User.findById(req.user.id).select('name');

    // Handle uploaded images
    const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];

    const product = new Product({
      name,
      description: description || '',
      category,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      images,
      seller: req.user.id,
      sellerName: seller ? seller.name : 'Unknown',
      badge: badge || 'New',
      color: color || '#e2e8f0',
      status: 'pending'
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Create product error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (owner only)
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { name, description, category, price, stock, status, badge, color } = req.body;

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (category) updateFields.category = category;
    if (price) updateFields.price = parseFloat(price);
    if (stock !== undefined) updateFields.stock = parseInt(stock);
    if (status) updateFields.status = status;
    if (badge) updateFields.badge = badge;
    if (color) updateFields.color = color;

    // If new images uploaded, add them
    if (req.files && req.files.length > 0) {
      updateFields.images = req.files.map(f => '/uploads/' + f.filename);
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error('Update product error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error('Delete product error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
