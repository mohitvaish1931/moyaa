// Database connection utility for serverless functions
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rrjewel';

let cachedClient: any = null;
let cachedDb: any = null;

export async function connectDB() {
  if (cachedClient) {
    return cachedDb;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  try {
    const client = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    cachedClient = client;
    cachedDb = client.connection.getClient();

    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDB() {
  if (cachedClient) {
    await mongoose.disconnect();
    cachedClient = null;
    cachedDb = null;
  }
}
