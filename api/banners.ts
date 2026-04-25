import { connectDB } from '../lib/mongodb';
import Banner from '../models/Banner';

export default async (req: any, res: any) => {
  try {
    await connectDB();
    
    if (req.method === 'GET') {
      const banners = await Banner.find().sort({ order: 1 });
      return res.json(banners);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Banners fetch error:', error);
    res.status(500).json({ error: error.message });
  }
};
