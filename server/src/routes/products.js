
const express = require('express');
const { db, placeholderImage } = require('../utils/db');
const { authGuard } = require('../middleware/auth');

module.exports = function() {
  const router = express.Router();

  // List with optional category + keyword search (title only)
  router.get('/', (req, res) => {
    const { category = '', q = '' } = req.query;
    let sql = 'SELECT p.id, p.title, p.price, p.category, COALESCE(p.image_url, ?) AS image_url FROM products p';
    const args = [placeholderImage];
    const conds = [];
    if (category) {
      conds.push('p.category = ?');
      args.push(category);
    }
    if (q) {
      conds.push('LOWER(p.title) LIKE ?');
      args.push(`%${q.toLowerCase()}%`);
    }
    if (conds.length) sql += ' WHERE ' + conds.join(' AND ');
    sql += ' ORDER BY p.id DESC';
    const rows = db.prepare(sql).all(...args);
    res.json(rows);
  });

  router.get('/:id', (req, res) => {
    const row = db.prepare('SELECT id, user_id, title, description, category, price, COALESCE(image_url, ?) AS image_url FROM products WHERE id = ?').get(placeholderImage, req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });

  // Create
  router.post('/', authGuard(process.env.JWT_SECRET || 'devsecret'), (req, res) => {
    const { title, description = '', category, price, image_url } = req.body;
    if (!title || !category || typeof price !== 'number') return res.status(400).json({ error: 'Missing fields' });
    const stmt = db.prepare('INSERT INTO products (user_id, title, description, category, price, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(req.userId, title, description, category, price, image_url || '', new Date().toISOString());
    const created = db.prepare('SELECT id, title, price, category, COALESCE(image_url, ?) AS image_url FROM products WHERE id = ?').get(placeholderImage, info.lastInsertRowid);
    res.status(201).json(created);
  });

  // Update (only owner)
  router.put('/:id', authGuard(process.env.JWT_SECRET || 'devsecret'), (req, res) => {
    const { id } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    if (product.user_id !== req.userId) return res.status(403).json({ error: 'Forbidden' });
    const { title, description, category, price, image_url } = req.body;
    db.prepare('UPDATE products SET title = ?, description = ?, category = ?, price = ?, image_url = ? WHERE id = ?')
      .run(title ?? product.title, description ?? product.description, category ?? product.category, (typeof price === 'number' ? price : product.price), image_url ?? product.image_url, id);
    const updated = db.prepare('SELECT id, title, price, category, COALESCE(image_url, ?) AS image_url FROM products WHERE id = ?').get(placeholderImage, id);
    res.json(updated);
  });

  // Delete (only owner)
  router.delete('/:id', authGuard(process.env.JWT_SECRET || 'devsecret'), (req, res) => {
    const { id } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    if (product.user_id !== req.userId) return res.status(403).json({ error: 'Forbidden' });
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ ok: true });
  });

  // My listings
  router.get('/me/listings/all', authGuard(process.env.JWT_SECRET || 'devsecret'), (req, res) => {
    const rows = db.prepare('SELECT id, title, price, category, COALESCE(image_url, ?) AS image_url FROM products WHERE user_id = ? ORDER BY id DESC').all('https://via.placeholder.com/600x400?text=EcoFinds', req.userId);
    res.json(rows);
  });

  return router;
}
