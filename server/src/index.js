import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://moraajewles.com', 'https://www.moraajewles.com', 'https://moyaa.onrender.com'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic CSP header to mirror the meta tag in index.html. Adjust for production tighter rules.
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' data: blob: https:; connect-src 'self' http://localhost:5000 ws://localhost:5173 ws://localhost:5000 https:; img-src 'self' data: blob: https:; media-src 'self' https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:; frame-src https:; worker-src 'self' blob:;");
  next();
});

import productsRouter from './routes/products.js';
import videosRouter from './routes/videos.js';
import bannersRouter from './routes/banners.js';
import couponsRouter from './routes/coupons.js';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import inventoryRouter from './routes/inventory.js';
import reviewsRouter from './routes/reviews.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

app.use('/api/products', productsRouter);
app.use('/api/videos', videosRouter);
app.use('/api/banners', bannersRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/reviews', reviewsRouter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serve frontend static files (built React app)
const distPath = path.join(__dirname, '..', '..', 'dist');
app.use(express.static(distPath));

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Catch-all: serve index.html for client-side routing (must be LAST)
// Only serve index.html if the file doesn't exist (for non-API routes)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://mohitlalwani1907:i070OBftf3M5kzus@cluster0.tzkp3vg.mongodb.net/rrjewel?retryWrites=true&w=majority';
console.log('Connecting to MongoDB:', mongoUri.replace(/\/\/.*:.*@/, '//***:***@'));

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ Connected to MongoDB successfully');
  
  // Seed an admin user if environment variables provided and no admin exists
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
  
  // Start server after DB connection
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.error('Make sure MONGO_URI is set to your MongoDB Atlas connection string');
  process.exit(1);
});
