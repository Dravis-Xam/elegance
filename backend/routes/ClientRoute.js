import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/client.js';
import { authenticateToken } from '../middleware/auth.js';
import sendEmail from '../utils/mailer.js';

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      preferredPaymentOption,
      role: 'customer',
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({
      message: 'User registered successfully',
      User: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
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

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
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
    const user = await User.findById(decoded.id).select('-password');
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

// change username and email, update database and return user
router.put('/change-creds', authenticateToken, async (req, res) => {
  const currentUsername = req.user.name;
  const { username, email } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username: currentUsername },
      { username, email },
      { new: true } // return the updated user
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

// send code for password recovery
router.post('/recover', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const code = Math.floor(100000 + Math.random() * 900000); // 6-digit code
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

  const token = jwt.sign({ email, code, expires }, process.env.JWT_SECRET, { expiresIn: '10m' });

  await sendEmail(email, `Your recovery code: ${code}`); // Nodemailer

  return res.json({ token }); // Frontend stores this
});

// verify-code
router.post('/verify-code', (req, res) => {
  const { token, code } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (parseInt(code) !== payload.code) {
      return res.status(400).json({ message: 'Invalid code' });
    }
    return res.json({ verified: true, email: payload.email });
  } catch (err) {
    return res.status(400).json({ message: 'Expired or invalid token' });
  }
});

// POST /auth/reset-password
router.post('/reset-password', authenticateToken, async (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });
  return res.json({ message: 'Password reset successful' });
});

// save profile photo url
router.put('/save-photo', authenticateToken, async (req, res) => {
  try {
    const { photo } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { photo }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update photo' });
  }
});



export default router;