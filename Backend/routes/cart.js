const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name category price stock images sellerName color'
    });

    if (!cart) {
      cart = { items: [], promo: '' };
    }

    res.json(cart);
  } catch (err) {
    console.error('Get cart error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/cart
// @desc    Sync/Save cart (replace full cart)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { items, promo } = req.body;
    // items: [{ product: <id>, qty: <number> }]

    let cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      cart.items = items || [];
      cart.promo = promo || '';
      await cart.save();
    } else {
      cart = new Cart({
        user: req.user.id,
        items: items || [],
        promo: promo || ''
      });
      await cart.save();
    }

    // Populate for response
    cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name category price stock images sellerName color'
    });

    res.json(cart);
  } catch (err) {
    console.error('Save cart error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/cart/add
// @desc    Add a single item to cart
// @access  Private
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, qty } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, qty: qty || 1 }]
      });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        existingItem.qty += (qty || 1);
      } else {
        cart.items.push({ product: productId, qty: qty || 1 });
      }
    }

    await cart.save();

    cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name category price stock images sellerName color'
    });

    res.json(cart);
  } catch (err) {
    console.error('Add to cart error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();

    const populated = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name category price stock images sellerName color'
    });

    res.json(populated);
  } catch (err) {
    console.error('Remove from cart error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ msg: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
