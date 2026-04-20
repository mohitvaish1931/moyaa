import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { getShiprocketToken, createShiprocketOrder, trackShipment } from '../utils/shiprocket.js';
import User from '../models/User.js';
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

    // Trigger Shiprocket shipment creation
    try {
      const user = await User.findById(order.user);
      const srData = await createShiprocketOrder(order, user?.email);

      if (srData && srData.order_id) {
        order.shiprocketOrderId = String(srData.order_id);
        order.shiprocketShipmentId = String(srData.shipment_id);
        await order.save();
      }
    } catch (srError) {
      console.error('Shiprocket creation error (payment confirmed, fulfillment failed):', srError.message);
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Tracking Info
router.get('/:orderId/tracking', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order || !order.shiprocketShipmentId) {
      return res.status(404).json({ error: 'Tracking info not available for this order' });
    }

    const trackingData = await trackShipment(order.shiprocketShipmentId);
    
    // Update local order tracking info if available
    if (trackingData && trackingData.tracking_data) {
      const info = trackingData.tracking_data;
      const shipment = info.shipment_track?.[0];
      
      if (shipment) {
        order.awbNumber = shipment.awb_code;
        order.courierName = shipment.courier_name;
        order.trackingStatus = shipment.current_status;
        
        // Map status to our order status
        if (shipment.current_status === 'Delivered') order.status = 'Delivered';
        else if (shipment.current_status === 'In Transit') order.status = 'Shipped';
        
        await order.save();
      }
    }

    res.json(trackingData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
