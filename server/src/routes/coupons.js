import express from 'express';
import Coupon from '../models/Coupon.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Coupon.find().sort({ createdAt: -1 }).populate('productId');
    res.json(items);
  } catch (err) {
    console.error('GET /api/coupons error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const c = new Coupon(req.body);
    await c.save();
    res.status(201).json(c);
  } catch (err) {
    console.error('POST /api/coupons error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:code', async (req, res) => {
  try {
    const updated = await Coupon.findOneAndUpdate({ code: req.params.code }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/coupons/:code error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:code', async (req, res) => {
  try {
    await Coupon.findOneAndDelete({ code: req.params.code });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/coupons/:code error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
