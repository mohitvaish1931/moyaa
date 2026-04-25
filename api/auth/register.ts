import { connectDB } from '../../lib/mongodb';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      passwordHash,
      name: name || '',
      isAdmin: false
    });

    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};
