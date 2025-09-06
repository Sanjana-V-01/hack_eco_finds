
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../utils/db');

module.exports = function(JWT_SECRET) {
  const router = express.Router();

  router.post('/register', (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const hash = bcrypt.hashSync(password, 10);
    try {
      const stmt = db.prepare('INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)');
      const info = stmt.run(email.trim().toLowerCase(), hash, username || '');
      // Create an empty cart for this user
      db.prepare('INSERT INTO carts (user_id) VALUES (?)').run(info.lastInsertRowid);
      const token = jwt.sign({ userId: info.lastInsertRowid }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token });
    } catch (e) {
      if (String(e).includes('UNIQUE')) return res.status(409).json({ error: 'Email already registered' });
      console.error(e);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  });

  return router;
}
