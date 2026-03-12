import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';

const uploadDir = path.join(path.resolve(), 'server', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2,6)}${ext}`);
  }
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

router.post('/', upload.array('image'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
      body.images = imageUrls;
      body.image = imageUrls[0]; // Set first image as primary
    }
    // Parse videos if sent as JSON string
    if (body.videos && typeof body.videos === 'string') {
      try {
        body.videos = JSON.parse(body.videos);
      } catch (e) {
        body.videos = [body.videos];
      }
    }
    const p = new Product(body);
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    console.error('POST /api/products error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.array('image'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
      body.images = imageUrls;
      body.image = imageUrls[0]; // Set first image as primary
    }
    // Parse videos if sent as JSON string
    if (body.videos && typeof body.videos === 'string') {
      try {
        body.videos = JSON.parse(body.videos);
      } catch (e) {
        body.videos = [body.videos];
      }
    }
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
