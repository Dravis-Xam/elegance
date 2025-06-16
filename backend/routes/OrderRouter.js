import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';
import pushUSSD from '../helpers/payment.js';

const router = express.Router();

// @desc    Get all Orders
// @route   GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Search Orders
// @route   GET /api/orders/search?q=...
router.get('/search', async (req, res) => {
  const { q } = req.query;
  const isObjectId = mongoose.Types.ObjectId.isValid(q);

  if (!q) return res.status(400).json({ message: "Missing search query" });

  try {
    const query = {
      $or: [
        { orderId: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { status: { $regex: q, $options: 'i' } }
      ]
    };

    if (isObjectId) {
      query.$or.unshift({ _id: new mongoose.Types.ObjectId(q) });
    }

    const orders = await Order.find(query);

    if (!orders.length) {
      return res.status(404).json({ message: `No order found matching '${q}'` });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create an Order
// @route   POST /api/orders/add
router.post('/add', async (req, res) => {
  try {
    const { username, status, productIds, amount, address } = req.body;

    const newOrder = new Order({
      orderId: uuidv4(),
      username,
      status,
      productIds,
      amount,
      address
    });

    const results = await pushUSSD(
        {amount, customerNo: address.contact, country: address.country, desc: 'daogrow beauty products'}
    );

    const createdOrder = await newOrder.save();
    res.status(201).json([createdOrder, results]);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update an Order
// @route   PUT /api/orders/edit/:id
router.put('/edit/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete an Order
// @route   DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.remove();
    res.json({ message: 'Order removed' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
