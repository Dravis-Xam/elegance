import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    preferredPaymentOption: {
      type: String,
      default: 'mpesa', 
    },
    contact: {
      type: String,
    },
     role: {
      type: String,
      default: 'client'
    }, photo: {
      type: String
    }
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
