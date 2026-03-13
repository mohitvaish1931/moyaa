import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import models
import Product from '../models/Product.js';

const seedProductsWithInventory = async () => {
  try {
    console.log('🌱 Starting products and inventory seed...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://mohitlalwani1907:i070OBftf3M5kzus@cluster0.tzkp3vg.mongodb.net/rrjewel?appName=Cluster0&retryWrites=true&w=majority';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Sample products with inventory
    const sampleProducts = [
      {
        name: 'Crystal Drop Earrings',
        price: 2499,
        originalPrice: 3499,
        category: 'earrings',
        description: 'Elegant crystal drop earrings perfect for any occasion. High-quality crystals with gold plating.',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
        sale: true,
        stock: 15,
        sku: 'EARN-CRYS-001',
        features: ['Crystal material', 'Gold plating', 'Hypoallergenic posts'],
        materials: ['Crystal', 'Gold-plated brass'],
        dimensions: '3cm drop',
        weight: '2.5g',
        careInstructions: ['Keep away from water', 'Store in dry place', 'Clean with soft cloth'],
        averageRating: 0,
        reviewCount: 0
      },
      {
        name: 'Pearl Stud Collection',
        price: 1899,
        originalPrice: 2299,
        category: 'earrings',
        description: 'Classic pearl stud earrings. Timeless elegance with premium quality pearls.',
        image: 'https://images.unsplash.com/photo-1599643478370-cdb3a5b7e0b-w=500',
        images: ['https://images.unsplash.com/photo-1599643478370-cdb3a5b7e0b-w=500'],
        sale: true,
        stock: 18,
        sku: 'EARN-PERL-001',
        features: ['Genuine pearls', 'Silver backing', 'Comfortable wear'],
        materials: ['Freshwater pearls', 'Silver-plated base'],
        dimensions: '0.8cm diameter',
        weight: '3g',
        careInstructions: ['Avoid moisture', 'Clean gently', 'Store separately'],
        averageRating: 0,
        reviewCount: 0
      },
      {
        name: 'Golden Chain Necklace',
        price: 4999,
        originalPrice: 6999,
        category: 'necklaces',
        description: 'Luxurious golden chain necklace. Perfect statement piece for any wardrobe.',
        image: 'https://images.unsplash.com/photo-1532632066848-b9c41e234e4d?w=500',
        images: ['https://images.unsplash.com/photo-1532632066848-b9c41e234e4d?w=500'],
        sale: true,
        stock: 8,
        sku: 'NECK-GOLD-001',
        features: ['18K gold plated', 'Long chain', 'Durable clasp'],
        materials: ['Gold-plated sterling silver'],
        dimensions: '50cm length',
        weight: '8g',
        careInstructions: ['Keep dry', 'Avoid perfumes', 'Regular polishing'],
        averageRating: 0,
        reviewCount: 0
      },
      {
        name: 'Delicate Bracelet',
        price: 1499,
        originalPrice: 1999,
        category: 'bracelets',
        description: 'Delicate and minimalist bracelet. Perfect for everyday wear.',
        image: 'https://images.unsplash.com/photo-1599643478305-b6f59de7e7b7?w=500',
        images: ['https://images.unsplash.com/photo-1599643478305-b6f59de7e7b7?w=500'],
        sale: false,
        stock: 12,
        sku: 'BRAC-DELI-001',
        features: ['Slim design', 'Adjustable', 'Hypoallergenic'],
        materials: ['Gold-plated brass'],
        dimensions: 'Fits 6.5"-7.5" wrist',
        weight: '4g',
        careInstructions: ['Remove during activities', 'Keep clean', 'Adjust gently'],
        averageRating: 0,
        reviewCount: 0
      },
      {
        name: 'Ruby Red Pendant',
        price: 3599,
        originalPrice: 4999,
        category: 'necklaces',
        description: 'Stunning ruby red pendant with intricate crafting. A true luxury piece.',
        image: 'https://images.unsplash.com/photo-1599643478305-b6f59de7e7b7?w=500',
        images: ['https://images.unsplash.com/photo-1599643478305-b6f59de7e7b7?w=500'],
        sale: true,
        stock: 7,
        sku: 'PEND-RUBY-001',
        features: ['Lab-created ruby', 'Pendant style', 'Chain included'],
        materials: ['Ruby set in silver'],
        dimensions: '2.5cm pendant',
        weight: '6g',
        careInstructions: ['Protect from impacts', 'Clean regularly', 'Store safely'],
        averageRating: 0,
        reviewCount: 0
      },
      {
        name: 'Diamond Studs',
        price: 5999,
        originalPrice: 8999,
        category: 'earrings',
        description: 'Timeless diamond studs. Every womans essential jewelry piece.',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
        sale: true,
        stock: 6,
        sku: 'EARN-DIAM-001',
        features: ['Cubic zirconia diamonds', 'Sterling silver', 'Secure posts'],
        materials: ['Cubic zirconia', 'Sterling silver'],
        dimensions: '0.6cm diameter',
        weight: '2g',
        careInstructions: ['Wear daily', 'Clean with solution', 'Professional care'],
        averageRating: 0,
        reviewCount: 0
      },
      {
        name: 'Emerald Bangle',
        price: 2499,
        originalPrice: 3299,
        category: 'bracelets',
        description: 'Beautiful emerald-colored bangle with elegant design.',
        image: 'https://images.unsplash.com/photo-1599643478305-b6f59de7e7b7?w=500',
        images: ['https://images.unsplash.com/photo-1599643478305-b6f59de7e7b7?w=500'],
        sale: false,
        stock: 11,
        sku: 'BRAC-EMER-001',
        features: ['Emerald colored stone', 'Solid bangle', 'Polished finish'],
        materials: ['Brass with green gemstone'],
        dimensions: '7cm diameter',
        weight: '12g',
        careInstructions: ['Keep dry', 'Avoid scratches', 'Regular polish'],
        averageRating: 0,
        reviewCount: 0
      },
      {
        name: 'Sapphire Necklace',
        price: 4299,
        originalPrice: 5999,
        category: 'necklaces',
        description: 'Elegant sapphire necklace. A luxury statement piece.',
        image: 'https://images.unsplash.com/photo-1532632066848-b9c41e234e4d?w=500',
        images: ['https://images.unsplash.com/photo-1532632066848-b9c41e234e4d?w=500'],
        sale: true,
        stock: 9,
        sku: 'NECK-SAPH-001',
        features: ['Lab sapphire', 'Gold chain', 'Premium clasp'],
        materials: ['Sapphire stone', 'Gold-plated chain'],
        dimensions: '45cm length',
        weight: '7g',
        careInstructions: ['Avoid harsh chemicals', 'Store separately', 'Professional cleaning'],
        averageRating: 0,
        reviewCount: 0
      },
      {
        name: 'Rose Gold Ring',
        price: 1999,
        originalPrice: 2799,
        category: 'rings',
        description: 'Beautiful rose gold ring with minimalist design.',
        image: 'https://images.unsplash.com/photo-1599643478305-b6f59de7e7b7?w=500',
        images: ['https://images.unsplash.com/photo-1599643478305-b6f59de7e7b7?w=500'],
        sale: true,
        stock: 14,
        sku: 'RING-ROSE-001',
        features: ['Rose gold plated', 'Comfortable band', 'Adjustable'],
        materials: ['Rose gold-plated brass'],
        dimensions: 'Fits US 5-9',
        weight: '3g',
        careInstructions: ['Keep dry', 'Remove during activities', 'Store safely'],
        averageRating: 0,
        reviewCount: 0
      }
    ];

    console.log(`\n📦 Seeding ${sampleProducts.length} products with inventory...`);

    // Clear existing products (optional - comment out to preserve existing data)
    // await Product.deleteMany({});

    // Create or update products
    let createdCount = 0;
    let updatedCount = 0;

    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = sampleProducts[i];
      
      // Check if product already exists
      const existing = await Product.findOne({ name: productData.name });
      
      if (existing) {
        // Update existing product with inventory data
        await Product.findByIdAndUpdate(
          existing._id,
          {
            stock: productData.stock,
            sku: productData.sku,
            averageRating: 0,
            reviewCount: 0
          },
          { new: true }
        );
        updatedCount++;
      } else {
        // Create new product
        await Product.create(productData);
        createdCount++;
      }
    }

    // Get summary statistics
    const allProducts = await Product.find();
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
      console.log(`  ${(cat._id || 'Uncategorized').toUpperCase()}:`);
      console.log(`    - Products: ${cat.count}`);
      console.log(`    - Total Stock: ${cat.totalStock}`);
      console.log(`    - Avg Stock Per Item: ${Math.round(cat.avgStock * 10) / 10}`);
    });

    const totalStockCount = allProducts.reduce((sum, p) => sum + p.stock, 0);

    console.log('\n✅ Seed completed successfully!');
    console.log(`   - Created: ${createdCount} new products`);
    console.log(`   - Updated: ${updatedCount} existing products`);
    console.log(`   - Total Products: ${allProducts.length}`);
    console.log(`   - Total Stock Across All Products: ${totalStockCount} units`);
    console.log(`   - All products ready for orders and reviews`);

    // Show sample of products
    console.log('\n📋 Sample Products:');
    const samples = await Product.find().limit(5).select('name stock sku category price averageRating reviewCount');
    samples.forEach((p, idx) => {
      console.log(`\n  ${idx + 1}. ${p.name}`);
      console.log(`     Price: ₹${p.price.toLocaleString()}`);
      console.log(`     Stock: ${p.stock} units | SKU: ${p.sku}`);
      console.log(`     Category: ${p.category}`);
      console.log(`     Rating: ${p.averageRating} ⭐ (${p.reviewCount} reviews)`);
    });

  } catch (error) {
    console.error('❌ Error during seed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the seed
seedProductsWithInventory();
