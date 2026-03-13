import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';

const uploadDir = path.join(path.resolve(), 'server', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2,6)}${ext}`);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for videos
});

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json(items || []);
  } catch (err) {
    console.error('GET /api/products error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products: ' + err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error('GET /api/products/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.fields([{ name: 'image', maxCount: 10 }, { name: 'videos_file', maxCount: 2 }]), async (req, res) => {
  try {
    const body = { ...req.body };
    const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    
    // Remove fields that shouldn't be in the database
    delete body.videos;
    
    // Handle image uploads
    if (req.files && req.files.image && req.files.image.length > 0) {
      const imageUrls = req.files.image.map(file => `${backendUrl}/uploads/${file.filename}`);
      body.images = imageUrls;
      body.image = imageUrls[0]; // Set first image as primary
    }
    
    // Handle video uploads and URLs
    let videos = [];
    
    // Add uploaded video files
    if (req.files && req.files.videos_file && req.files.videos_file.length > 0) {
      const videoUrls = req.files.videos_file.map(file => `${backendUrl}/uploads/${file.filename}`);
      videos = [...videos, ...videoUrls];
    }
    
    // Parse and add video URLs from request body
    if (req.body.videos) {
      try {
        let parsedVideos = [];
        if (typeof req.body.videos === 'string') {
          parsedVideos = JSON.parse(req.body.videos);
        } else if (Array.isArray(req.body.videos)) {
          parsedVideos = req.body.videos;
        }
        
        // Filter out placeholder file references
        const urlVideos = parsedVideos.filter((v) => !v.startsWith('__file_'));
        videos = [...videos, ...urlVideos];
      } catch (e) {
        console.warn('Error parsing videos:', e);
      }
    }
    
    // Set videos if any exist
    if (videos.length > 0) {
      body.videos = videos;
    }
    
    const p = new Product(body);
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    console.error('POST /api/products error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.fields([{ name: 'image', maxCount: 10 }, { name: 'videos_file', maxCount: 2 }]), async (req, res) => {
  try {
    const body = { ...req.body };
    const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    
    // Remove fields that shouldn't be updated directly
    delete body.videos;
    delete body._id;
    
    // Handle image uploads
    if (req.files && req.files.image && req.files.image.length > 0) {
      const imageUrls = req.files.image.map(file => `${backendUrl}/uploads/${file.filename}`);
      body.images = imageUrls;
      body.image = imageUrls[0]; // Set first image as primary
    }
    
    // Handle video uploads and URLs
    let videos = [];
    
    // Add uploaded video files
    if (req.files && req.files.videos_file && req.files.videos_file.length > 0) {
      const videoUrls = req.files.videos_file.map(file => `${backendUrl}/uploads/${file.filename}`);
      videos = [...videos, ...videoUrls];
    }
    
    // Parse and add video URLs from request body
    if (req.body.videos) {
      try {
        let parsedVideos = [];
        if (typeof req.body.videos === 'string') {
          parsedVideos = JSON.parse(req.body.videos);
        } else if (Array.isArray(req.body.videos)) {
          parsedVideos = req.body.videos;
        }
        
        // Filter out placeholder file references
        const urlVideos = parsedVideos.filter((v) => !v.startsWith('__file_'));
        videos = [...videos, ...urlVideos];
      } catch (e) {
        console.warn('Error parsing videos:', e);
      }
    }
    
    // Set videos if any exist
    if (videos.length > 0) {
      body.videos = videos;
    }
    
    const updated = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/products/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/products/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
