import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
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
  careInstructions: [String]
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
