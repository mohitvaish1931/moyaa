import express from 'express';
import Banner from '../models/Banner.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Banner.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

router.post('/', async (req, res) => {
  const b = new Banner(req.body);
  await b.save();
  res.status(201).json(b);
});

router.put('/:id', async (req, res) => {
  const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
