import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import models
import Product from '../models/Product.js';

const fixOutOfStock = async () => {
  try {
    console.log('🔧 Fixing out-of-stock products...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://mohitlalwani1907:i070OBftf3M5kzus@cluster0.tzkp3vg.mongodb.net/rrjewel?appName=Cluster0&retryWrites=true&w=majority';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find all products with "hello" in the name
    const products = await Product.find({ name: /hello/i });
    console.log(`📦 Found ${products.length} product(s) with "hello" in name`);

    if (products.length === 0) {
      // If no "hello" product, find the first out-of-stock product
      const outOfStockProducts = await Product.find({ $or: [{ soldOut: true }, { stock: { $lte: 0 } }] });
      console.log(`Found ${outOfStockProducts.length} out-of-stock products`);
      
      if (outOfStockProducts.length > 0) {
        const product = outOfStockProducts[0];
        console.log(`📝 Updating product: ${product.name}`);
        product.soldOut = false;
        product.stock = 10;
        await product.save();
        console.log(`✅ Updated ${product.name} - soldOut: false, stock: 10`);
      }
    } else {
      // Update all "hello" products
      for (const product of products) {
        console.log(`📝 Updating product: ${product.name}`);
        product.soldOut = false;
        product.stock = 10;
        await product.save();
        console.log(`✅ Updated ${product.name} - soldOut: false, stock: 10`);
      }
    }

    console.log('✨ Fix complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

fixOutOfStock();
