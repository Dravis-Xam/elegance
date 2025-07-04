import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      username: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ] 
  ,
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ]
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;