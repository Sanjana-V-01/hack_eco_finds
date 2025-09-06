
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { db, initDb, placeholderImage, CATEGORIES } = require('./utils/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

app.use(cors());
app.use(express.json());

// Initialize database & seed categories
initDb();

// Simple health route
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes(JWT_SECRET));
app.use('/api/products', productRoutes());
app.use('/api/users', userRoutes(JWT_SECRET));
app.use('/api/cart', cartRoutes(JWT_SECRET));
app.use('/api/orders', orderRoutes(JWT_SECRET));

app.listen(PORT, () => {
  console.log(`EcoFinds server running on http://localhost:${PORT}`);
});
