import express from 'express';
import { getTestimonials, addTestimonial, deleteTestimonial, toggleLike, comment, search } from '../helpers/Testimonial.js';
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

router.get('/search', authenticateToken, search);

router.put('/comment/:id', authenticateToken, comment);

export default router;