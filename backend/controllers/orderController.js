import Order from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';
import pushUSSD from '../helpers/payment.js';
import mongoose from 'mongoose';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findOne({ username: req.user.username });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ orderId: id, username: req.user.username });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const searchOrders = async (req, res) => {
  const { q } = req.query;
  const isObjectId = mongoose.Types.ObjectId.isValid(q);
  const query = {
    $or: [
      { orderId: { $regex: q, $options: 'i' } },
      { username: { $regex: q, $options: 'i' } },
      { status: { $regex: q, $options: 'i' } }
    ]
  };
  if (isObjectId) query.$or.unshift({ _id: new mongoose.Types.ObjectId(q) });

  try {
    const orders = await Order.find(query);
    if (!orders.length) return res.status(404).json({ message: 'No matching orders' });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addOrder = async (req, res) => {
  try {
    const { status, productIds, amount, address } = req.body;
    const username = req.user.username;

    const newOrder = new Order({
      orderId: uuidv4(),
      username,
      status,
      productIds,
      amount,
      address
    });

    const results = await pushUSSD({
      amount,
      customerNo: address.contact,
      country: address.country,
      desc: 'daogrow beauty products'
    });

    const createdOrder = await newOrder.save();
    req.notify('Purchase', { metadata: createdOrder });

    res.status(201).json([createdOrder, results]);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });

    req.notify('Order update', { updated });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.remove();
    res.json({ message: 'Order removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order' });
  }
};
