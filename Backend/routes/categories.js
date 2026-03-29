const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

// Static category list matching the frontend's known categories
const STATIC_CATEGORIES = [
  'Art & Crafts',
  'Fashion',
  'Stationery',
  'Home Decor',
  'Tech Accessories',
  'Beauty & Wellness',
  'Food & Snacks',
  'Books & Notes',
  'Sports & Fitness',
  'Electronics'
];

// ─────────────────────────────────────────────
// @route  GET /api/categories
// @desc   Return the full category list with live product counts
// @access Public
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // Aggregate product counts per active category
    const counts = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach(c => { countMap[c._id] = c.count; });

    const categories = STATIC_CATEGORIES.map(name => ({
      name,
      count: countMap[name] || 0
    }));

    res.json({ categories });
  } catch (err) {
    console.error('Categories error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
