import { connectDB } from '../../lib/mongodb';
import Order from '../../models/Order';

export default async (req: any, res: any) => {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    }

    if (req.method === 'PUT') {
      const { orderId, status, paymentStatus } = req.body;
      if (!orderId) return res.status(400).json({ error: 'Order ID is required' });

      const updateData: any = {};
      if (status) updateData.status = status;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
      if (!order) return res.status(404).json({ error: 'Order not found' });

      return res.json(order);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Orders fetch/update error:', err);
    res.status(500).json({ error: err.message });
  }
};
