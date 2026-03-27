const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty:      { type: Number, default: 1, min: 1 }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [CartItemSchema],
  promo: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update timestamp
CartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
