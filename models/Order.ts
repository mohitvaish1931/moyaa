import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, required: true },
    selectedSize: String,
    selectedShape: String,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, enum: ['Prepaid', 'COD'], default: 'Prepaid' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'COD'], default: 'Pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  shiprocketOrderId: String,
  shiprocketShipmentId: String,
  awbNumber: String,
  courierName: String,
  trackingUrl: String,
  trackingStatus: String,
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
