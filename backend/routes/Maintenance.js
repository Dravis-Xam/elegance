import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorise.js';

const router = express.Router();

router.post('/schedule', authenticateToken, authorizeRole('developer'), async (req, res) => {
  const { start, duration } = req.body;

  req.notify('Maintenance', { start, duration });

  res.status(200).json({ success: true, message: 'Maintenance scheduled and notification sent.' });
});

router.get('/enable', authenticateToken, authorizeRole('developer'), async (req, res) => {
  res.status(200).json({ message: 'Maintenance mode enabled.' });
});

router.get('/disable', authenticateToken, authorizeRole('developer'), async (req, res) => {
  res.status(200).json({ message: 'Maintenance mode disabled.' });
});

export default router;
