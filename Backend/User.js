const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller', 'both'], default: 'buyer' },
  campus: { type: String },
  phone: { type: String },
  bio: { type: String },
  storeName: { type: String },
  payoutMethod: { type: String },
  payoutNumber: { type: String },
  wishlist: [{ type: String }], // Array of product names or IDs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);