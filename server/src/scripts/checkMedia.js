import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const ProductSchema = new mongoose.Schema({
  name: String,
  image: String,
  images: [String],
  category: String
});

const Product = mongoose.model('Product', ProductSchema);

const checkMedia = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("Error: MONGO_URI environment variable is not defined.");
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');
        
        const products = await Product.find().limit(20);
        console.log(`Found ${products.length} products\n`);
        
        products.forEach(p => {
            console.log(`Name: ${p.name}`);
            console.log(`Image: ${p.image}`);
            console.log(`Images: ${JSON.stringify(p.images)}`);
            console.log('---');
        });
        
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}

checkMedia();
