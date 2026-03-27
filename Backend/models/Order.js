const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  qty:      { type: Number, required: true },
  seller:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  buyer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:     [OrderItemSchema],
  subtotal:  { type: Number, required: true },
  delivery:  { type: Number, default: 0 },
  discount:  { type: Number, default: 0 },
  total:     { type: Number, required: true },
  promo:     { type: String, default: '' },
  status:    { type: String, enum: ['processing', 'shipped', 'completed', 'cancelled'], default: 'processing' },
  address:   { type: String },
  phone:     { type: String },
  note:      { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
