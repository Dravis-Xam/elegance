import express from 'express';
import Product from '../models/Product.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
import mongoose from 'mongoose';
router.get('/search', async (req, res) => {
  const { q } = req.query;
  const isObjectId = mongoose.Types.ObjectId.isValid(q);

  if (!q) return res.status(400).json({ message: "Missing search query" });

  try {
    const query = {
      $or: [
        { id: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    };

    if (isObjectId) {
      query.$or.unshift({ _id: new mongoose.Types.ObjectId(q) });
    }

    const products = await Product.find(query);

    if (!products.length) {
      return res.status(404).json({ message: `No product found matching '${q}'` });
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});




// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/add', async (req, res) => {
  try {
    const {
      name,
      category,
      attributes,
      thumbnail, 
      price,
      unitQuantity,
      amountInStock,
    } = req.body;

    
    const product = new Product({
      id: uuidv4(),
      name,
      category,
      attributes: Array.isArray(attributes) ? attributes : [],
      thumbnail: Array.isArray(thumbnail) ? thumbnail : [],
      price: parseFloat(price),
      unitQuantity: Array.isArray(unitQuantity) ? unitQuantity : [],
      amountInStock: parseInt(amountInStock),
    });

    const createdProduct = await product.save();

    
    req.notify('New product', {metadata: createdProduct});

    res.status(201).json(createdProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/edit/:id',  async (req, res) => {
  try {
    const { name, category, attributes, price, unitQuantity, amountInStock } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Process new thumbnails
    const newThumbnails = req.files?.map(file => file.path) || [];
    
    // Process attributes and unitQuantity from strings to arrays
    const attributesArray = typeof attributes === 'string' ? 
      attributes.split(',').map(attr => attr.trim()) : 
      attributes || [];
      
    const unitQuantityArray = typeof unitQuantity === 'string' ? 
      unitQuantity.split(',').map(unit => unit.trim()) : 
      unitQuantity || [];

    // Update product fields
    product.name = name || product.name;
    product.category = category || product.category;
    product.attributes = attributesArray.length ? attributesArray : product.attributes;
    product.thumbnail = newThumbnails.length ? [...product.thumbnail, ...newThumbnails] : product.thumbnail;
    product.price = price ? parseFloat(price) : product.price;
    product.unitQuantity = unitQuantityArray.length ? unitQuantityArray : product.unitQuantity;
    product.amountInStock = amountInStock ? parseInt(amountInStock) : product.amountInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Missing search query" });

  try {
    const products = await Product.find({
      $or: [
        { id: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    });

    if (!products.length) {
      return res.status(404).json({ message: `No product found matching '${q}'` });
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;