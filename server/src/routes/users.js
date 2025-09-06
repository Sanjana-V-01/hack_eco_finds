
const express = require('express');
const { db, CATEGORIES } = require('../utils/db');
const { authGuard } = require('../middleware/auth');

module.exports = function(JWT_SECRET) {
  const router = express.Router();
  router.get('/me', authGuard(JWT_SECRET), (req, res) => {
    const user = db.prepare('SELECT id, email, username FROM users WHERE id = ?').get(req.userId);
    res.json(user);
  });

  router.put('/me', authGuard(JWT_SECRET), (req, res) => {
    const { username } = req.body;
    db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username || '', req.userId);
    const user = db.prepare('SELECT id, email, username FROM users WHERE id = ?').get(req.userId);
    res.json(user);
  });

  router.get('/categories', (_req, res) => {
    res.json(CATEGORIES);
  });

  return router;
}
