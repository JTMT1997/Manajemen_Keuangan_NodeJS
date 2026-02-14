// finance-app/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ========================
// REGISTER
// ========================
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Cek apakah username sudah ada
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role = 'user' jika tidak diisi
    const userRole = role && role === 'admin' ? 'admin' : 'user';

    const user = await User.create({ username, password: hashedPassword, role: userRole });

    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// LOGIN
// ========================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Cek password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    // Buat token JWT, sertakan id dan role
const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET, // <-- harus ada value
  { expiresIn: '1d' }
);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
