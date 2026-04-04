import mongoose from 'mongoose';
const m = mongoose.default || mongoose;
const { Schema, model } = m;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  image: String,
  images: [String],
  sale: Boolean,
  soldOut: Boolean,
  category: String,
  description: String,
  features: [String],
  materials: [String],
  dimensions: String,
  weight: String,
  careInstructions: [String],
  specifications: [String],
  stock: { type: Number, default: 0 },
  sizes: [String],
  shapes: [String],
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

const Product = model('Product', ProductSchema);
export default Product;
