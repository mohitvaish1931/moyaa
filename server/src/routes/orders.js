import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { getShiprocketToken } from '../utils/shiprocket.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_YOUR_KEY_SECRET'
});

// 1. Create a Razorpay order
router.post('/create', async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    // Amount needs to be in paise (₹1 = 100 paise)
    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'Pending'
    });

    await newOrder.save();

    res.status(201).json({
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Verify payment and trigger Shiprocket shipment
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    order.paymentStatus = 'Paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.status = 'Processing';
    await order.save();

    // Trigger Shiprocket shipment creation (asynchronously or after verification)
    try {
      const token = await getShiprocketToken();
      if (token) {
        const shiprocketOrderData = {
          order_id: String(order._id),
          order_date: new Date().toISOString().split('T')[0],
          pickup_location: "Primary", // This should match a location in Shiprocket panel
          billing_customer_name: order.shippingAddress.name.split(' ')[0],
          billing_last_name: order.shippingAddress.name.split(' ').slice(1).join(' ') || ' ',
          billing_address: order.shippingAddress.address,
          billing_city: order.shippingAddress.city,
          billing_pincode: order.shippingAddress.pincode,
          billing_state: order.shippingAddress.state,
          billing_country: "India",
          billing_email: "customer@example.com", // You might want to get this from User model
          billing_phone: order.shippingAddress.phone,
          shipping_is_billing: true,
          order_items: order.items.map(item => ({
            name: item.name,
            sku: item.product?._id || item.product?.id || 'sku-unknown',
            units: item.quantity,
            selling_price: item.price
          })),
          payment_method: "Prepaid",
          sub_total: order.totalAmount,
          length: 10, // Default dimensions
          width: 10,
          height: 10,
          weight: 0.5
        };

        const srRes = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', shiprocketOrderData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (srRes.data && srRes.data.order_id) {
          order.shiprocketOrderId = String(srRes.data.order_id);
          order.shiprocketShipmentId = String(srRes.data.shipment_id);
          await order.save();
        }
      }
    } catch (srError) {
      console.error('Shiprocket creation error (ignored to confirm payment):', srError.response?.data || srError.message);
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Get User Orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
