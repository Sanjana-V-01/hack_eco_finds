
const express = require('express');
const { db } = require('../utils/db');
const { authGuard } = require('../middleware/auth');

module.exports = function(JWT_SECRET) {
  const router = express.Router();

  // Ensure a cart exists for the user
  function ensureCart(userId) {
    let cart = db.prepare('SELECT * FROM carts WHERE user_id = ?').get(userId);
    if (!cart) {
      db.prepare('INSERT INTO carts (user_id) VALUES (?)').run(userId);
      cart = db.prepare('SELECT * FROM carts WHERE user_id = ?').get(userId);
    }
    return cart;
  }

  router.get('/', authGuard(JWT_SECRET), (req, res) => {
    const cart = ensureCart(req.userId);
    const items = db.prepare(`
      SELECT ci.product_id, ci.qty, p.title, p.price, COALESCE(p.image_url, 'https://via.placeholder.com/600x400?text=EcoFinds') AS image_url 
      FROM cart_items ci 
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = ?
    `).all(cart.id);
    res.json({ items });
  });

  router.post('/add', authGuard(JWT_SECRET), (req, res) => {
    const { productId, qty = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    const cart = ensureCart(req.userId);
    const existing = db.prepare('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?').get(cart.id, productId);
    if (existing) {
      db.prepare('UPDATE cart_items SET qty = qty + ? WHERE id = ?').run(qty, existing.id);
    } else {
      db.prepare('INSERT INTO cart_items (cart_id, product_id, qty) VALUES (?, ?, ?)').run(cart.id, productId, qty);
    }
    return res.json({ ok: true });
  });

  router.post('/remove', authGuard(JWT_SECRET), (req, res) => {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    const cart = ensureCart(req.userId);
    db.prepare('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?').run(cart.id, productId);
    res.json({ ok: true });
  });

  router.post('/checkout', authGuard(JWT_SECRET), (req, res) => {
    const cart = ensureCart(req.userId);
    const items = db.prepare(`
      SELECT ci.product_id, ci.qty, p.title, p.price, p.image_url
      FROM cart_items ci JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = ?
    `).all(cart.id);
    if (items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
    const orderInfo = db.prepare('INSERT INTO orders (user_id, created_at) VALUES (?, ?)').run(req.userId, new Date().toISOString());
    const orderId = orderInfo.lastInsertRowid;
    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, qty, price, title, image_url) VALUES (?, ?, ?, ?, ?, ?)');
    const delItems = db.prepare('DELETE FROM cart_items WHERE cart_id = ?');
    const tx = db.transaction(() => {
      for (const it of items) {
        insertItem.run(orderId, it.product_id, it.qty, it.price, it.title, it.image_url || '');
      }
      delItems.run(cart.id);
    });
    tx();
    res.json({ ok: true, orderId });
  });

  return router;
}
