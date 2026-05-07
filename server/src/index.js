import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
const m = mongoose.default || mongoose;
const { connect } = m;
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://moraajewles.com',
      'https://www.moraajewles.com',
      'https://moraajewels.com',
      'https://www.moraajewels.com',
      'https://moraajewles.com/'
    ];

    const isAllowed = allowedOrigins.includes(origin) ||
      origin.includes('vercel.app') ||
      origin.includes('moraajewles.com') ||
      origin.includes('moraajewels.com');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(express.json());

// Basic CSP header to mirror the meta tag in index.html. Adjust for production tighter rules.
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' data: blob: https:; connect-src 'self' http://localhost:5000 ws://localhost:5173 ws://localhost:5000 https://moyaa-3kxy.onrender.com https://moyaalatest.onrender.com https://moyaa.onrender.com https:; img-src 'self' data: blob: https:; media-src 'self' https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: blob:; style-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:; frame-src https:; worker-src 'self' blob:;");
  next();
});

import productsRouter from './routes/products.js';
import videosRouter from './routes/videos.js';
import bannersRouter from './routes/banners.js';
import couponsRouter from './routes/coupons.js';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import ordersRouter from './routes/orders.js';
import shiprocketRouter from './routes/shiprocket.js';
import reviewsRouter from './routes/reviews.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

app.use('/api/products', productsRouter);
app.use('/api/videos', videosRouter);
app.use('/api/banners', bannersRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/shiprocket', shiprocketRouter);
app.use('/api/reviews', reviewsRouter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'RRJEWEL API Server', status: 'running', version: '1.0.0' });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;

connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rrjewel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  // Seed an admin user if environment variables provided and no admin exists
  (async () => {
    try {
      if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!existing) {
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
          await User.create({
            email: process.env.ADMIN_EMAIL,
            passwordHash,
            name: 'Admin',
            isAdmin: true,
          });
          console.log('Admin user created from env variables');
        }
      }
    } catch (e) {
      console.warn('Admin seeding error', e);
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })();
}).catch((err) => {
  console.error('MongoDB connection error', err);
  process.exit(1);
});
