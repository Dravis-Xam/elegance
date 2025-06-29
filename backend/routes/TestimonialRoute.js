import express from 'express';
import { getTestimonials, addTestimonial, deleteTestimonial, toggleLike } from '../helpers/Testimonial.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Route to get all testimonials
router.get('/get', getTestimonials);

// Route to add a new testimonial
router.post('/add', authenticateToken, addTestimonial);

// Route to like a testimonial
router.patch('/:id/toggle-like', authenticateToken, toggleLike);

// Route to delete a testimonial by ID
router.delete('/:id', authenticateToken, deleteTestimonial);

export default router;