
const express = require('express');
const { db } = require('../utils/db');
const { authGuard } = require('../middleware/auth');

module.exports = function(JWT_SECRET) {
  const router = express.Router();

  router.get('/', authGuard(JWT_SECRET), (req, res) => {
    const orders = db.prepare('SELECT id, created_at FROM orders WHERE user_id = ? ORDER BY id DESC').all(req.userId);
    const itemsStmt = db.prepare('SELECT product_id, qty, price, title, image_url FROM order_items WHERE order_id = ?');
    const result = orders.map(o => ({
      ...o,
      items: itemsStmt.all(o.id)
    }));
    res.json(result);
  });

  return router;
}
