const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users/me
// @desc    Get current user's full profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', auth, async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'bio', 'campus', 'avatar',
      'storeName', 'storeDesc', 'listingCat',
      'payoutMethod', 'payoutNumber',
      'deliveryAddr', 'preferredPay', 'notifyOrders', 'favCat',
      'role'
    ];

    const updateFields = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Update user error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT /api/users/wishlist
// @desc    Update wishlist
// @access  Private
router.put('/wishlist', auth, async (req, res) => {
  try {
    const { productId, action } = req.body; // action: 'add' or 'remove'

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (action === 'add' && !user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
    } else if (action === 'remove') {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('Wishlist error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET /api/users/wishlist
// @desc    Get user's wishlist with populated product details
// @access  Private
router.get('/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('Get wishlist error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
