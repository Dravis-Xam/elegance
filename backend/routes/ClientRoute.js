import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Client from '../models/client.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, preferredPaymentOption } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newClient = new Client({
      username,
      email,
      password: hashedPassword,
      preferredPaymentOption,
      role: 'client',
    });

    await newClient.save();

    const token = jwt.sign({ id: newClient._id, role: newClient.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({
      message: 'Client registered successfully',
      client: {
        id: newClient._id,
        username: newClient.username,
        email: newClient.email,
        role: newClient.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const client = await Client.findOne({ email });
    if (!client || !(await bcrypt.compare(password, client.password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: client._id, role: client.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    res.json({
      message: 'Login successful',
      client: {
        id: client._id,
        username: client.username,
        email: client.email,
        role: client.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Client.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      userId: user._id,
      username: user.username,
      role: user.role,
      exp: decoded.exp,
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
});

export default router;