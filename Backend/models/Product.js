const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  category:    { type: String, required: true },
  price:       { type: Number, required: true },
  stock:       { type: Number, default: 0 },
  images:      [{ type: String }],                       // URLs or filenames
  seller:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerName:  { type: String },                          // Denormalized for fast reads
  status:      { type: String, enum: ['active', 'pending', 'sold'], default: 'pending' },
  badge:       { type: String, default: 'New' },
  featured:    { type: Boolean, default: false },
  rating:      { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  color:       { type: String, default: '#e2e8f0' },      // Placeholder color
  createdAt:   { type: Date, default: Date.now }
});

// Text index for search
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
