import express from 'express';
import Product from '../models/Product.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get inventory for a product
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('stock sku name');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({
      productId: product._id,
      name: product.name,
      stock: product.stock,
      sku: product.sku,
      inStock: product.stock > 0
    });
  } catch (err) {
    console.error('GET /api/inventory/product/:id error:', err.message);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Get all inventory (admin only)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().select('name stock sku price').sort({ name: 1 });
    const inventory = products.map(p => ({
      productId: p._id,
      name: p.name,
      sku: p.sku,
      stock: p.stock,
      price: p.price,
      status: p.stock > 0 ? 'In Stock' : 'Out of Stock',
      lowStock: p.stock < 5
    }));
    res.json(inventory);
  } catch (err) {
    console.error('GET /api/inventory error:', err.message);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Update inventory (admin only)
router.put('/product/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ error: 'Valid stock quantity required' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    ).select('name stock sku');

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({
      message: 'Inventory updated successfully',
      product: {
        productId: product._id,
        name: product.name,
        stock: product.stock,
        sku: product.sku
      }
    });
  } catch (err) {
    console.error('PUT /api/inventory/product/:id error:', err.message);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// Reduce stock (when item is added to cart/order)
router.put('/reduce/:id', requireAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.stock < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient stock',
        available: product.stock,
        requested: quantity
      });
    }

    product.stock -= quantity;
    await product.save();

    res.json({
      message: 'Stock reduced successfully',
      productId: product._id,
      newStock: product.stock
    });
  } catch (err) {
    console.error('PUT /api/inventory/reduce/:id error:', err.message);
    res.status(500).json({ error: 'Failed to reduce inventory' });
  }
});

// Restore stock (when item is removed from cart/order is cancelled)
router.put('/restore/:id', requireAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity required' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: quantity } },
      { new: true }
    ).select('name stock');

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({
      message: 'Stock restored successfully',
      productId: product._id,
      newStock: product.stock
    });
  } catch (err) {
    console.error('PUT /api/inventory/restore/:id error:', err.message);
    res.status(500).json({ error: 'Failed to restore inventory' });
  }
});

// Get low stock products (admin only)
router.get('/low-stock/list', requireAuth, requireAdmin, async (req, res) => {
  try {
    const threshold = req.query.threshold || 5;
    const products = await Product.find({ stock: { $lt: threshold } })
      .select('name stock sku price category')
      .sort({ stock: 1 });
    
    res.json({
      threshold,
      count: products.length,
      products
    });
  } catch (err) {
    console.error('GET /api/inventory/low-stock/list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
});

export default router;
