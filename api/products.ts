import { connectDB } from '../lib/mongodb';
import Product from '../models/Product';

export default async (req: any, res: any) => {
  try {
    await connectDB();
    
    if (req.method === 'GET') {
      const { category, search } = req.query;
      let query: any = { status: 'published' };
      
      if (category && category !== 'all') {
        query.category = category.toLowerCase();
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }
      
      const products = await Product.find(query).sort({ displayOrder: 1, createdAt: -1 });
      return res.json(products);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: error.message });
  }
};
