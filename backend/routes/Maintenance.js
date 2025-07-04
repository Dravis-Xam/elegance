import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorise.js';

const router = express.Router();

router.get('/start', authenticateToken, authorizeRole('developer'), (req, res) => {
  res.status(200).json({ message: 'Maintenance mode is active.' });
});

router.get('/status', authenticateToken, authorizeRole('developer', 'admin'), (req, res) => {
  const isMaintenanceMode = req.isMaintenanceMode();
  if (isMaintenanceMode) {
    return res.status(200).json({ message: 'Maintenance mode is currently active.' });
  }
  res.status(200).json({ message: 'Maintenance mode is currently inactive.' });
});

router.get('/errors', authenticateToken, authorizeRole('developer', 'admin'), (req, res) => {
  const errors = req.getErrors();
  if (!errors || errors.length === 0) {
    return res.status(404).json({ message: 'No errors found.' });
  }
  res.status(200).json(errors);
});

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
