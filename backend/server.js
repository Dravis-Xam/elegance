import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/ClientRoute.js';
import productRoutes from './routes/ProductRoute.js';
import testimonialRoute from './routes/TestimonialRoute.js';
import orderRoutes from './routes/OrderRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import notificationMiddleware from './middleware/updates.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // create HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/testimonials', testimonialRoute);

// ✅ Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  // Emit test notifications
  app.use(notificationMiddleware(io));

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server after DB connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection failed:', err.message));
