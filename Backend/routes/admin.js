const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');

// All admin routes require auth + admin role
router.use(auth, isAdmin);

// ─────────────────────────────────────────────
// @route  GET /api/admin/stats
// @desc   Platform-wide dashboard stats
// @access Admin
// ─────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalProducts, pendingProducts, totalOrders, revenueResult] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'pending' }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const totalRevenue = revenueResult.length ? revenueResult[0].total : 0;

    // Monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders:  { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      pendingProducts,
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      monthlyRevenue
    });
  } catch (err) {
    console.error('Admin stats error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────
// @route  GET /api/admin/products/pending
// @desc   Get all pending products awaiting approval
// @access Admin
// ─────────────────────────────────────────────
router.get('/products/pending', async (req, res) => {
  try {
    const products = await Product.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('seller', 'name email campus storeName');

    res.json({ products });
  } catch (err) {
    console.error('Admin pending products error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────
// @route  GET /api/admin/products
// @desc   Get all products (with optional filters)
// @access Admin
// ─────────────────────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const { status, category, search, page, limit } = req.query;
    let query = {};

    if (status)   query.status   = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name:       { $regex: search, $options: 'i' } },
        { sellerName: { $regex: search, $options: 'i' } }
      ];
    }

    const perPage     = parseInt(limit) || 20;
    const currentPage = parseInt(page)  || 1;
    const skip        = (currentPage - 1) * perPage;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate('seller', 'name email'),
      Product.countDocuments(query)
    ]);

    res.json({ products, total, page: currentPage, pages: Math.ceil(total / perPage) });
  } catch (err) {
    console.error('Admin all products error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────
// @route  PUT /api/admin/products/:id/approve
// @desc   Approve a pending product (set status to active)
// @access Admin
// ─────────────────────────────────────────────
router.put('/products/:id/approve', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'active', featured: false } },
      { new: true }
    );

    if (!product) return res.status(404).json({ msg: 'Product not found' });

    res.json({ msg: 'Product approved', product });
  } catch (err) {
    console.error('Admin approve product error:', err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────
// @route  PUT /api/admin/products/:id/reject
// @desc   Reject a pending product (set status back to pending with reason)
// @access Admin
// ─────────────────────────────────────────────
router.put('/products/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    // We delete the product on rejection — seller must re-submit
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    res.json({ msg: 'Product rejected and removed', reason: reason || '' });
  } catch (err) {
    console.error('Admin reject product error:', err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────
// @route  DELETE /api/admin/products/:id
// @desc   Hard-delete any product
// @access Admin
// ─────────────────────────────────────────────
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    res.json({ msg: 'Product deleted' });
  } catch (err) {
    console.error('Admin delete product error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────
// @route  GET /api/admin/orders
// @desc   Get all orders platform-wide (with filters + pagination)
// @access Admin
// ─────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    let query = {};
    if (status) query.status = status;

    const perPage     = parseInt(limit) || 20;
    const currentPage = parseInt(page)  || 1;
    const skip        = (currentPage - 1) * perPage;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate('buyer', 'name email campus')
        .populate('items.product', 'name images'),
      Order.countDocuments(query)
    ]);

    res.json({ orders, total, page: currentPage, pages: Math.ceil(total / perPage) });
  } catch (err) {
    console.error('Admin orders error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────
// @route  GET /api/admin/users
// @desc   Get all users (with optional role / status filter)
// @access Admin
// ─────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { role, status, search, page, limit } = req.query;
    let query = {};

    if (role) query.role = role;
    if (status === 'suspended') query.isSuspended = true;
    if (status === 'active')    query.isSuspended = false;
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const perPage     = parseInt(limit) || 50;
    const currentPage = parseInt(page)  || 1;
    const skip        = (currentPage - 1) * perPage;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      User.countDocuments(query)
    ]);

    // Attach order count per user
    const userIds = users.map(u => u._id);
    const orderCounts = await Order.aggregate([
      { $match: { buyer: { $in: userIds } } },
      { $group: { _id: '$buyer', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    orderCounts.forEach(o => { countMap[o._id.toString()] = o.count; });

    const usersWithOrders = users.map(u => ({
      ...u.toObject(),
      orderCount: countMap[u._id.toString()] || 0
    }));

    res.json({ users: usersWithOrders, total, page: currentPage, pages: Math.ceil(total / perPage) });
  } catch (err) {
    console.error('Admin users error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────
// @route  PUT /api/admin/users/:id/status
// @desc   Suspend or reactivate a user account
// @access Admin
// Body:   { suspended: true | false }
// ─────────────────────────────────────────────
router.put('/users/:id/status', async (req, res) => {
  try {
    const { suspended } = req.body;

    if (typeof suspended !== 'boolean') {
      return res.status(400).json({ msg: '"suspended" must be true or false' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isSuspended: suspended } },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({ msg: suspended ? 'User suspended' : 'User reactivated', user });
  } catch (err) {
    console.error('Admin user status error:', err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────
// @route  DELETE /api/admin/users/:id
// @desc   Permanently delete a user account
// @access Admin
// ─────────────────────────────────────────────
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Remove their products too
    await Product.deleteMany({ seller: req.params.id });

    res.json({ msg: 'User and their products deleted' });
  } catch (err) {
    console.error('Admin delete user error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
