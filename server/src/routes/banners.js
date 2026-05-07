import express from 'express';
import Banner from '../models/Banner.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'moyaa-banners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

const upload = multer({ storage });
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('GET /api/banners error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.image = req.file.secure_url || req.file.path;
    }
    const b = new Banner(body);
    await b.save();
    res.status(201).json(b);
  } catch (err) {
    console.error('POST /api/banners error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.image = req.file.secure_url || req.file.path;
    }
    const updated = await Banner.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/banners/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/banners/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
