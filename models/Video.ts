import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: String,
  url: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
