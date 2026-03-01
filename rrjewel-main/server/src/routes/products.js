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
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/', upload.single('image'), async (req, res) => {
  const body = { ...req.body };
  if (req.file) {
    body.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  const p = new Product(body);
  await p.save();
  res.status(201).json(p);
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const body = { ...req.body };
  if (req.file) {
    body.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  const updated = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
