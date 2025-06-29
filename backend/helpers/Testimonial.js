import Testimonial from "../models/Testimonial.js";


//get testimonial from database
export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Add a new testimonial to the database
export const addTestimonial = async (req, res) => {
    const { username, message } = req.body;

    const newTestimonial = new Testimonial({ // Simple unique ID based on timestamp
        username,
        message
    });

    try {
        await newTestimonial.save();
        res.status(201).json(newTestimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // ← make sure `authenticateToken` adds this

  try {
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const alreadyLiked = testimonial.likedBy.includes(userId);

    if (alreadyLiked) {
      // Unlike
      testimonial.likedBy.pull(userId);
      testimonial.likes -= 1;
    } else {
      // Like
      testimonial.likedBy.push(userId);
      testimonial.likes += 1;
    }

    await testimonial.save();
    res.status(200).json({ testimonial, liked: !alreadyLiked });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a testimonial by ID
export const deleteTestimonial = async (req, res) => {
    const { id } = req.params;

    try {
        const testimonial = await Testimonial.findByIdAndDelete({id, userId});
        if (testimonial.username !== req.user.username) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }
        res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}