import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  username: { type: String, sparse: true },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
