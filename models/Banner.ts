import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  text: String,
  type: { type: String, enum: ['info','hot','new','sold-out'], default: 'info' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
