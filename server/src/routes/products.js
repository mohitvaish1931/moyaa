import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const getPublicBaseUrl = (req) => {
  const forwardedProto = req.get('x-forwarded-proto');
  const proto = (forwardedProto || req.protocol || 'https').split(',')[0].trim();
  const host = req.get('x-forwarded-host') || req.get('host');
  return `${proto}://${host}`;
};

const normalizeUploadUrl = (req, value) => {
  if (!value || typeof value !== 'string') return value;
  if (value.startsWith('/uploads/')) {
    return `${getPublicBaseUrl(req)}${value}`;
  }
  if (value.includes('/uploads/')) {
    const idx = value.indexOf('/uploads/');
    if (idx !== -1) {
      return `${getPublicBaseUrl(req)}${value.slice(idx)}`;
    }
  }
  return value;
};

const normalizeProductMedia = (req, productDoc) => {
  const product = productDoc.toObject ? productDoc.toObject() : { ...productDoc };

  product.image = normalizeUploadUrl(req, product.image);
  if (Array.isArray(product.images)) {
    product.images = product.images.map((img) => normalizeUploadUrl(req, img));
  }

  return product;
};

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
    res.json(items.map((item) => normalizeProductMedia(req, item)));
  } catch (err) {
    console.error('GET /api/products error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(normalizeProductMedia(req, item));
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
      const urls = files.map((f) => `${getPublicBaseUrl(req)}/uploads/${f.filename}`);
      body.image = urls[0];
      body.images = urls;
    } else {
      body.image = normalizeUploadUrl(req, body.image);
      if (typeof body.images === 'string') {
        try {
          const parsed = JSON.parse(body.images);
          body.images = Array.isArray(parsed) ? parsed : [];
        } catch {
          body.images = [];
        }
      }
      if (Array.isArray(body.images)) {
        body.images = body.images.map((img) => normalizeUploadUrl(req, img));
      }
    }

    // Parse array fields if they are sent as JSON strings
    ['materials', 'specifications', 'sizes'].forEach(field => {
      if (typeof body[field] === 'string') {
        try {
          const parsed = JSON.parse(body[field]);
          body[field] = Array.isArray(parsed) ? parsed : [body[field]];
        } catch (e) {
          // Keep as string or handle error - here we keep it as is
        }
      }
    });

    const p = new Product(body);
    await p.save();
    res.status(201).json(normalizeProductMedia(req, p));
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
      const urls = files.map((f) => `${getPublicBaseUrl(req)}/uploads/${f.filename}`);
      body.image = urls[0];
      body.images = urls;
    } else {
      body.image = normalizeUploadUrl(req, body.image);
      if (typeof body.images === 'string') {
        try {
          const parsed = JSON.parse(body.images);
          body.images = Array.isArray(parsed) ? parsed : [];
        } catch {
          body.images = [];
        }
      }
      if (Array.isArray(body.images)) {
        body.images = body.images.map((img) => normalizeUploadUrl(req, img));
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
    res.json(normalizeProductMedia(req, updated));
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
