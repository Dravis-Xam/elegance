import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/client.js';
import { authenticateToken } from '../middleware/auth.js';
import sendEmail from '../utils/mailer.js';
import { authorizeRole } from '../middleware/authorise.js';

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

    res.status(201).json({
      message: 'User registered successfully',
      User: {
        userId: newUser._id,
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

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    res.json({
      message: 'Login successful',
      user: {
        userId: user._id,
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

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      userId: user._id,
      username: user.username,
      role: user.role,
      exp: req.user.exp, // assuming 'exp' is part of req.user from the token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
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

    req.notify('Credentials change');
    return res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

// update payment option
router.put('/update-payment-option', authenticateToken, async (req, res) => {
  const currentUsername = req.user.name;
  const { preferredPaymentOption, contact } = req.body;

  try {
    const getUser = async() => {
      
    if(contact) {
        return await User.findOneAndUpdate(
          { username: currentUsername },
          { preferredPaymentOption, contact },
          { new: true } // return the updated user
        );
      } else {
        return await User.findOneAndUpdate(
          { username: currentUsername },
          { preferredPaymentOption },
          { new: true } // return the updated user
        );
      }
    }

    const user = await getUser();
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.notify('Credentials change');
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
  req.notify('Password change');
  return res.json({ message: 'Password reset successful' });
});

// save profile photo url
router.put('/save-photo', authenticateToken, async (req, res) => {
  try {
    const { photo } = req.body;
    const user = await User.findByIdAndUpdate(req.user.userId, { photo }, { new: true });
    req.notify('Profile photo');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update photo' });
  }
});

router.get('/clients', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch clients', error: err.message });
  }
});

router.delete('/clients/delete/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    req.notify('Client deleted');
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete client', error: err.message });
  }
});

router.put('/clients/edit/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { username, email, preferredPaymentOption, role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { username, email, preferredPaymentOption, role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    req.notify('Client updated');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update client', error: err.message });
  }
});

router.get('/clients/search', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      $or: [
        { username: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') },
      ],
      role: 'customer',
    }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search clients', error: err.message });
  }
});

router.post('/clients/add', authenticateToken, authorizeRole('admin'),async (req, res) => {
  const { username, email, password, preferredPaymentOption, role } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      preferredPaymentOption,
      role: role || 'customer',
    });

    await newUser.save();
    req.notify('Client added');
    res.status(201).json({
      message: 'Client added successfully',
      user: {
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

export default router;