import { connectDB } from '../lib/mongodb';
import Video from '../models/Video';

export default async (req: any, res: any) => {
  try {
    await connectDB();
    
    if (req.method === 'GET') {
      const videos = await Video.find().sort({ createdAt: -1 });
      return res.json(videos);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Videos fetch error:', error);
    res.status(500).json({ error: error.message });
  }
};
