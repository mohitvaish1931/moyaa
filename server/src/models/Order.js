import mongoose from 'mongoose';
const m = mongoose.default || mongoose;
const { Schema, model } = m;

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
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
  orderNumber: { type: String, unique: true },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' }
}, { timestamps: true });

const Order = model('Order', OrderSchema);
export default Order;
