import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import models
import Product from '../models/Product.js';

const seedInventory = async () => {
  try {
    console.log('🌱 Starting inventory seed...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://mohitlalwani1907:i070OBftf3M5kzus@cluster0.tzkp3vg.mongodb.net/rrjewel?appName=Cluster0&retryWrites=true&w=majority';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get all products
    const products = await Product.find();
    console.log(`📦 Found ${products.length} products`);

    if (products.length === 0) {
      console.log('⚠️  No products found in database. Please add products first.');
      process.exit(0);
    }

    // Define inventory levels for different categories
    const categoryStock = {
      'earrings': 15,
      'bracelets': 10,
      'necklaces': 8,
      'rings': 12,
      'pendants': 10
    };

    // Seed inventory data
    let updatedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Determine stock based on category (fallback to 10 if category not found)
      const category = product.category ? product.category.toLowerCase() : 'default';
      const stock = categoryStock[category] || 10;
      
      // Generate SKU if not present
      const sku = product.sku || `SKU-${product._id.toString().slice(-8).toUpperCase()}`;

      // Update product with inventory data
      const updated = await Product.findByIdAndUpdate(
        product._id,
        {
          stock,
          sku,
          $setOnInsert: {
            averageRating: 0,
            reviewCount: 0
          }
        },
        { new: true, upsert: true }
      );

      updatedCount++;

      // Log progress
      if ((updatedCount) % 5 === 0) {
        console.log(`  📊 Updated ${updatedCount}/${products.length} products...`);
      }
    }

    // Get summary statistics
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalStock: { $sum: '$stock' },
          count: { $sum: 1 },
          avgStock: { $avg: '$stock' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📈 Inventory Summary by Category:');
    console.log('===================================');
    summary.forEach(cat => {
      console.log(`  ${cat._id || 'Uncategorized'}:`);
      console.log(`    - Products: ${cat.count}`);
      console.log(`    - Total Stock: ${cat.totalStock}`);
      console.log(`    - Avg Stock: ${Math.round(cat.avgStock * 10) / 10}`);
    });

    console.log('\n✅ Inventory seeding completed successfully!');
    console.log(`   - Updated ${updatedCount} products`);
    console.log(`   - All products now have stock tracking enabled`);
    console.log(`   - All products have SKU codes`);
    console.log(`   - Ready for reviews system`);

    // Show sample of updated products
    console.log('\n📋 Sample Updated Products:');
    const samples = await Product.find().limit(3).select('name stock sku category averageRating reviewCount');
    samples.forEach(p => {
      console.log(`  - ${p.name}`);
      console.log(`    Stock: ${p.stock}, SKU: ${p.sku}, Category: ${p.category}`);
      console.log(`    Rating: ${p.averageRating} ⭐ (${p.reviewCount} reviews)`);
    });

  } catch (error) {
    console.error('❌ Error seeding inventory:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the seed
seedInventory();
