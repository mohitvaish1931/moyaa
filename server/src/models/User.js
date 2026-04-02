import mongoose from 'mongoose';
const m = mongoose.default || mongoose;
const { Schema, model } = m;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

export default model('User', UserSchema);
