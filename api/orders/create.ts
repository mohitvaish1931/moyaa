import { connectDB } from '../../lib/mongodb';
import Order from '../../models/Order';
import User from '../../models/User';
import Razorpay from 'razorpay';
import { createShiprocketOrder } from '../../lib/shiprocket';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export default async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { userId, items, totalAmount, shippingAddress, paymentMethod = 'Prepaid' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    let razorpayOrderId = null;
    let razorpayAmount = 0;
    let razorpayCurrency = 'INR';

    if (paymentMethod === 'Prepaid') {
      const options = {
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      };

      const razorpayOrder = await razorpay.orders.create(options);
      razorpayOrderId = razorpayOrder.id;
      razorpayAmount = options.amount;
      razorpayCurrency = options.currency;
    }

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      razorpayOrderId,
      paymentStatus: 'Pending',
      status: 'Processing'
    });

    await newOrder.save();

    if (paymentMethod === 'COD') {
      try {
        const user = await User.findById(userId);
        const srData = await createShiprocketOrder(newOrder, user?.email);

        if (srData && srData.order_id) {
          newOrder.shiprocketOrderId = String(srData.order_id);
          newOrder.shiprocketShipmentId = String(srData.shipment_id);
          await newOrder.save();
        }
      } catch (srError: any) {
        console.error('Shiprocket creation error for COD:', srError.message);
      }
    }

    res.status(201).json({
      orderId: newOrder._id,
      paymentMethod,
      razorpayOrderId,
      amount: razorpayAmount,
      currency: razorpayCurrency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
};
