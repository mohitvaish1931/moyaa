import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'moyaa-products',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'],
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('GET /api/products error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error('GET /api/products/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.array('image', 10), async (req, res) => {
  try {
    const body = { ...req.body };
    const files = req.files || [];

    if (files.length > 0) {
      // Files uploaded to Cloudinary - req.files[i].secure_url contains the Cloudinary URL
      const urls = files.map((f) => f.secure_url);
      body.image = urls[0];
      body.images = urls;
    } else {
      // Handle direct Cloudinary URLs if provided in the body
      if (typeof body.images === 'string') {
        try {
          const parsed = JSON.parse(body.images);
          body.images = Array.isArray(parsed) ? parsed : [];
        } catch {
          body.images = [];
        }
      }
    }

    // Parse array fields if they are sent as JSON strings
    ['materials', 'specifications', 'sizes'].forEach(field => {
      if (typeof body[field] === 'string') {
        try {
          const parsed = JSON.parse(body[field]);
          body[field] = Array.isArray(parsed) ? parsed : [body[field]];
        } catch (e) {
          // Keep as is
        }
      }
    });

    const p = new Product(body);
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    console.error('POST /api/products error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.array('image', 10), async (req, res) => {
  try {
    const body = { ...req.body };
    const files = req.files || [];

    if (files.length > 0) {
      // Files uploaded to Cloudinary
      const urls = files.map((f) => f.secure_url);
      body.image = urls[0];
      body.images = urls;
    } else {
      // Keep existing images or handle direct Cloudinary URLs
      if (typeof body.images === 'string') {
        try {
          const parsed = JSON.parse(body.images);
          body.images = Array.isArray(parsed) ? parsed : [];
        } catch {
          body.images = [];
        }
      }
    }

    // Parse array fields if they are sent as JSON strings
    ['materials', 'specifications', 'sizes'].forEach(field => {
      if (typeof body[field] === 'string') {
        try {
          const parsed = JSON.parse(body[field]);
          body[field] = Array.isArray(parsed) ? parsed : [body[field]];
        } catch (e) {
          // Keep as is
        }
      }
    });

    const updated = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/products/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/products/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
