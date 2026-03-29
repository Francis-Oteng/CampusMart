const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  role:          { type: String, enum: ['buyer', 'seller', 'both'], default: 'buyer' },
  campus:        { type: String },
  phone:         { type: String },
  bio:           { type: String },
  avatar:        { type: String },
  storeName:     { type: String },
  storeDesc:     { type: String },
  listingCat:    { type: String },
  payoutMethod:  { type: String },
  payoutNumber:  { type: String },
  deliveryAddr:  { type: String },
  preferredPay:  { type: String },
  notifyOrders:  { type: String },
  favCat:        { type: String },
  isAdmin:       { type: Boolean, default: false },
  isSuspended:   { type: Boolean, default: false },
  wishlist:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  joinDate:      { type: Date, default: Date.now },
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
