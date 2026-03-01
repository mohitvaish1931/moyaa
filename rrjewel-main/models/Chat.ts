import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: String,
    userEmail: String,
    message: { type: String, required: true },
    type: { type: String, enum: ['user', 'admin'], default: 'user' },
    adminResponse: String,
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
