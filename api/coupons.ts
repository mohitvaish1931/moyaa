import { connectDB } from '../lib/mongodb';
import Coupon from '../models/Coupon';

export default async (req: any, res: any) => {
  try {
    await connectDB();
    
    if (req.method === 'GET') {
      const coupons = await Coupon.find();
      return res.json(coupons);
    }

    if (req.method === 'POST') {
      const { code } = req.body;
      const coupon = await Coupon.findOne({ code, active: true });
      
      if (!coupon) {
        return res.status(404).json({ error: 'Invalid or inactive coupon code' });
      }

      if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
        return res.status(400).json({ error: 'Coupon has expired' });
      }

      return res.json(coupon);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Coupons fetch/validate error:', error);
    res.status(500).json({ error: error.message });
  }
};
