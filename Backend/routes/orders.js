const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET /api/orders
// @desc    Get buyer's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images')
      .populate('items.seller', 'name');

    res.json({ orders });
  } catch (err) {
    console.error('Get orders error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET /api/orders/seller
// @desc    Get seller's incoming orders
// @access  Private
router.get('/seller', auth, async (req, res) => {
  try {
    // Find orders that contain items from this seller
    const orders = await Order.find({ 'items.seller': req.user.id })
      .sort({ createdAt: -1 })
      .populate('buyer', 'name email')
      .populate('items.product', 'name images price');

    // Filter items to show only this seller's items
    const sellerOrders = orders.map(order => {
      const myItems = order.items.filter(item => item.seller && item.seller.toString() === req.user.id);
      const myTotal = myItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
      return {
        _id: order._id,
        buyer: order.buyer,
        items: myItems,
        total: myTotal,
        status: order.status,
        createdAt: order.createdAt
      };
    });

    res.json({ orders: sellerOrders });
  } catch (err) {
    console.error('Get seller orders error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/orders
// @desc    Create an order from cart
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { address, phone, note } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name category price stock seller sellerName'
    });

    if (!cart || !cart.items.length) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    // Build order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      qty: item.qty,
      seller: item.product.seller
    }));

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = subtotal >= 350 ? 0 : 25;

    // Handle promo discount
    const PROMOS = {
      'STUDENT10': { type: 'pct', value: 10 },
      'CAMPUS20':  { type: 'pct', value: 20 },
      'FLAT50':    { type: 'fixed', value: 50 },
      'NEWUSER':   { type: 'pct', value: 15 }
    };

    let discount = 0;
    if (cart.promo && PROMOS[cart.promo]) {
      const promo = PROMOS[cart.promo];
      discount = promo.type === 'pct'
        ? Math.round(subtotal * promo.value / 100 * 100) / 100
        : promo.value;
      discount = Math.min(discount, subtotal);
    }

    const total = Math.max(0, subtotal + delivery - discount);

    // Create order
    const order = new Order({
      buyer: req.user.id,
      items: orderItems,
      subtotal,
      delivery,
      discount,
      total,
      promo: cart.promo || '',
      status: 'processing',
      address: address || '',
      phone: phone || '',
      note: note || ''
    });

    await order.save();

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.qty }
      });
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user.id });

    res.json(order);
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (seller)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body; // processing, shipped, completed, cancelled

    const validStatuses = ['processing', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Verify seller has items in this order
    const isSeller = order.items.some(item => item.seller && item.seller.toString() === req.user.id);
    const isBuyer = order.buyer.toString() === req.user.id;

    if (!isSeller && !isBuyer) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
