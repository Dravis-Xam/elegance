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
import Sentry from './utils/sentry.js'; // Import Sentry for error tracking
import RequestLog from './models/RequestLog.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // create HTTP server
const io = new Server(server, {
  cors: {
    origin: 'https://elegance-pjkv.vercel.app',//'https://elegance-pjkv.vercel.app'
    credentials: true
  }
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'https://elegance-pjkv.vercel.app', //https://elegance-pjkv.vercel.app
  credentials: true,
}));
app.use(Sentry.Handlers.requestHandler());

app.use(async (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      responseTime: duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };

    // 1. Save to MongoDB
    try {
      await RequestLog.create(logData);
    } catch (err) {
      console.error('Failed to save request log:', err.message);
    }

    // 2. Send to Sentry (optional: only log slow or failed requests)
    if (res.statusCode >= 400 || duration > 1000) {
      Sentry.captureMessage(
        `[${req.method}] ${req.originalUrl} responded ${res.statusCode} in ${duration}ms`,
        {
          level: res.statusCode >= 500 ? 'error' : 'warning',
          extra: logData,
        }
      );
    }
  });

  next();
});


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

app.use(Sentry.Handlers.errorHandler()); // After all routes

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});


// Start server after DB connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection failed:', err.message));
