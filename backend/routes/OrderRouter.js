import express from 'express';
import {
  getAllOrders,
  getUserOrders,
  getOrderById,
  searchOrders,
  addOrder,
  updateOrder,
  deleteOrder
} from '../controllers/orderController.js';

import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorise.js';

const router = express.Router();

router.get('/all', authenticateToken, authorizeRole('admin'), getAllOrders);
router.get('/', authenticateToken, getUserOrders);
router.get('/search', authenticateToken, searchOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/add', authenticateToken, addOrder);
router.put('/edit/:id', authenticateToken, updateOrder);
router.delete('/:id', authenticateToken, deleteOrder);

export default router;
