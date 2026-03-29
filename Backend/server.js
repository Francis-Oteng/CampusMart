require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ── Middleware ──
app.use(cors({
  origin: '*',  // Allow all origins in dev
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/categories', require('./routes/categories'));

// ── Health Check ──
app.get('/', (req, res) => res.send('CampusMart API Running'));

// ── MongoDB Connection ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('⚠️  MongoDB not available:', err.message);
    console.log('   Server will run but database features won\'t work.');
    console.log('   Set MONGO_URI in .env to a valid MongoDB connection string.');
  });

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));