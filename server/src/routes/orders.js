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

// 1. Create an order (Prepaid or COD)
router.post('/create', async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress, paymentMethod = 'Prepaid' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    let razorpayOrderId = null;
    let razorpayAmount = 0;
    let razorpayCurrency = 'INR';

    if (paymentMethod === 'Prepaid') {
      // Amount needs to be in paise (₹1 = 100 paise)
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

    // Generate sequential order number
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });
    let nextNum = 1001;
    if (lastOrder && lastOrder.orderNumber) {
      const lastNum = parseInt(lastOrder.orderNumber.split('-')[1]);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }
    const orderNumber = `MOR-${nextNum}`;

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      razorpayOrderId,
      orderNumber,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      status: 'Processing'
    });

    await newOrder.save();

    // For COD, trigger Shiprocket immediately
    if (paymentMethod === 'COD') {
      try {
        const user = await User.findById(userId);
        const srData = await createShiprocketOrder(newOrder, user?.email);

        if (srData && srData.order_id) {
          newOrder.shiprocketOrderId = String(srData.order_id);
          newOrder.shiprocketShipmentId = String(srData.shipment_id);
          await newOrder.save();
        }
      } catch (srError) {
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

// 3. Track order by Order Number and Email
router.post('/track', async (req, res) => {
  try {
    const { orderNumber, email } = req.body;
    
    if (!orderNumber || !email) {
      return res.status(400).json({ error: 'Order number and email are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No order found with this email and order number' });
    }

    // Find order by orderNumber and user
    const order = await Order.findOne({ orderNumber, user: user._id });
    if (!order) {
      return res.status(404).json({ error: 'No order found with this email and order number' });
    }

    // If order has shiprocketShipmentId, fetch latest tracking
    let trackingDetails = null;
    if (order.shiprocketShipmentId) {
      try {
        const trackingData = await trackShipment(order.shiprocketShipmentId);
        if (trackingData && trackingData.tracking_data) {
          trackingDetails = trackingData.tracking_data;
          
          // Update order status if possible
          const shipment = trackingDetails.shipment_track?.[0];
          if (shipment) {
            order.awbNumber = shipment.awb_code;
            order.courierName = shipment.courier_name;
            order.trackingStatus = shipment.current_status;
            
            if (shipment.current_status === 'Delivered') order.status = 'Delivered';
            else if (shipment.current_status === 'In Transit' || shipment.current_status === 'Shipped') order.status = 'Shipped';
            
            await order.save();
          }
        }
      } catch (trackErr) {
        console.error('Shiprocket tracking fetch error:', trackErr.message);
      }
    }

    res.json({
      success: true,
      order,
      trackingDetails
    });
  } catch (err) {
    console.error('Track order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Tracking Info by MongoDB ID
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
        else if (shipment.current_status === 'In Transit' || shipment.current_status === 'Shipped') order.status = 'Shipped';
        
        await order.save();
      }
    }

    res.json(trackingData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get all orders (Admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Update order status (Admin)
router.put('/:orderId', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
