import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  image: String,
  images: [String],
  videos: [String],
  sale: Boolean,
  soldOut: { type: Boolean, default: false },
  category: String,
  subcategory: String,
  description: String,
  materials: [String],
  specifications: [String],
  dimensions: String,
  weight: String,
  sizes: [String],
  shapes: [String],
  colors: [String],
  careInstructions: [String],
  productLink: String,
  status: { type: String, default: 'published' },
  displayOrder: { type: Number, default: 0 },
  stock: { type: Number, default: 999, min: 0 },
  sku: { type: String, unique: true, sparse: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
