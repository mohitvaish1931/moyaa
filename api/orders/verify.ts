import { connectDB } from '../../lib/mongodb';
import Order from '../../models/Order';
import User from '../../models/User';
import crypto from 'crypto';
import { createShiprocketOrder } from '../../lib/shiprocket';

export default async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Razorpay secret not configured' });
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.paymentStatus = 'Paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    try {
      const user = await User.findById(order.user);
      const srData = await createShiprocketOrder(order, user?.email);

      if (srData && srData.order_id) {
        order.shiprocketOrderId = String(srData.order_id);
        order.shiprocketShipmentId = String(srData.shipment_id);
        await order.save();
      }
    } catch (srError: any) {
      console.error('Shiprocket order creation failed during verification:', srError.message);
    }

    res.json({ success: true, message: 'Payment verified and order confirmed' });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    res.status(500).json({ error: err.message });
  }
};
