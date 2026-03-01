import express from 'express';
import Video from '../models/Video.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

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

router.get('/', async (req, res) => {
  const items = await Video.find().sort({ createdAt: -1 });
  res.json(items);
});

// Accept multipart form with optional file field 'file' or JSON body { title, url }
router.post('/', upload.single('file'), async (req, res) => {
  const body = { ...(req.body || {}) };
  if (req.file) {
    body.url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    body.title = body.title || req.file.originalname;
  }
  const v = new Video(body);
  await v.save();
  res.status(201).json(v);
});

router.delete('/:id', async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
