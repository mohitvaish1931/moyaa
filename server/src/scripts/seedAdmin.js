import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rrjewel';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
const FORCE_ADMIN_PASSWORD_RESET =
  String(process.env.FORCE_ADMIN_PASSWORD_RESET || 'false').toLowerCase() === 'true';

async function seedAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment variables.');
  }

  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });

    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await User.create({
        email: ADMIN_EMAIL,
        passwordHash,
        name: ADMIN_NAME,
        isAdmin: true,
      });

      console.log(`Admin user created: ${ADMIN_EMAIL}`);
      return;
    }

    let updated = false;

    if (!existingUser.isAdmin) {
      existingUser.isAdmin = true;
      updated = true;
    }

    if (FORCE_ADMIN_PASSWORD_RESET) {
      const salt = await bcrypt.genSalt(10);
      existingUser.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);
      updated = true;
    }

    if (updated) {
      await existingUser.save();
      console.log(`Admin user updated: ${ADMIN_EMAIL}`);
    } else {
      console.log(`Admin user already exists with admin access: ${ADMIN_EMAIL}`);
    }
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed admin user:', error.message);
    process.exit(1);
  });
