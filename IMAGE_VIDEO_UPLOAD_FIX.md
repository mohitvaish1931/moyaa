# Image & Video Upload Fixed - Implementation Guide

## Issues Fixed ✅

### 1. **Image Upload Handling**
- Added proper FormData handling in Admin.tsx
- Images are now properly collected from file input and appended to FormData
- Fixed imageFiles state management to track uploaded files separately

### 2. **Video Support Enhanced**
- Added error handling for video loading
- Support for YouTube, Vimeo, and direct video file uploads
- Added video file and URL validation
- Improved video embedding for different sources

### 3. **Image Loading with Fallbacks**
- Created comprehensive `mediaHelper.ts` utility with:
  - `getImageUrl()` - Converts relative paths to full URLs
  - `handleImageError()` - Shows placeholder on load failure
  - `getVideoUrl()` - Handles video embedding formats
  - Image and video file validation with size/type checking
  - Error event handlers with fallback images

### 4. **Component Updates**
- **ProductDetail.tsx**: Added media helper for image/video display with error handling
- **Earrings.tsx**: Updated to use media helper for product images
- **Bracelets.tsx**: Updated to use media helper for product images
- **Necklaces.tsx**: Updated to use media helper for product images
- **Admin.tsx**: Enhanced form submission with better error feedback

---

## How Image Upload Now Works

### Frontend (Admin.tsx)
```javascript
1. User selects images via file input
2. Files are stored in imageFiles state
3. Preview URLs generated using URL.createObjectURL()
4. On form submit:
   - FormData created from form
   - Existing image field cleared
   - imageFiles appended as 'image' field (multiple)
   - Sent to API_ENDPOINTS.PRODUCTS
```

### Backend (server/src/routes/products.js)
```javascript
1. Multer receives image files
2. Files saved to server/uploads/ directory
3. Full URLs generated: http://localhost:5000/uploads/{filename}
4. URLs stored in MongoDB as images array
5. First image set as primary image field
```

### Frontend Display (ProductDetail.tsx)
```javascript
1. Image URLs retrieved from product.images array
2. getImageUrl() converts to full URLs if needed
3. Images displayed with onError={handleImageError}
4. On error, shows placeholder image
```

---

## Testing Image Upload

### Step 1: Start the backend server
```bash
cd server
npm run dev
# Server should run on http://localhost:5000
```

### Step 2: Start the frontend
```bash
npm run dev
# Frontend should run on http://localhost:5173
```

### Step 3: Upload a test product
1. Go to Admin page
2. Click "Add Product"
3. Fill in product details
4. **Select multiple images** from your device
5. You should see preview thumbnails
6. Click "Add Product"
7. Check browser console for any errors

### Step 4: View uploaded images
1. Go to Products or category page
2. Click on the product
3. Images should load with proper URLs
4. Edit the browser address bar to see what image URL is being requested

---

## Troubleshooting

### Images Still Not Loading?

#### **Problem: Images showing placeholder**
**Solution**: Check browser Network tab
- Look for image requests to `http://localhost:5000/uploads/...`
- If 404 error: Images weren't saved to server
- If CORS error: Update CORS in server/src/index.js

#### **Fix CORS if needed**
In `server/src/index.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

#### **Problem: "Image not found" icon appears**
**Solutions**:
1. Check server is running on port 5000
2. Verify uploads folder exists: `server/uploads/`
3. Check file permissions: `chmod -R 755 server/uploads/`
4. Clear browser cache (Ctrl+Shift+Delete)

#### **Problem: Form submission fails silently**
**Solution**: Check browser console for errors
- Right-click → Inspect → Console tab
- Look for error messages
- Check server console for logs

---

## Video Upload Process

### Supported Video Types:
- **Embed URLs**: YouTube, Vimeo links
- **Direct uploads**: MP4, WebM (up to 100MB)
- **Direct URLs**: https://... link to video file

### How Videos Are Handled:
```javascript
1. User can add up to 2 videos
2. Can paste embed URLs OR upload files
3. Files saved to server/uploads/
4. URLs stored in product.videos array
5. On display:
   - If embed URL (YouTube/Vimeo): Show iframe
   - If direct file: Show <video> tag with controls
```

---

## Key Environment Variables Needed

### Frontend (`.env` or vite environment)
```
VITE_API_BASE=http://localhost:5000
```

### Backend `.env` file
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rrjewel
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourpassword
```

---

## File Structure After Upload

```
server/
├── uploads/
│   ├── 1234567890-abc123.jpg      ← Image files
│   ├── 1234567891-def456.mp4      ← Video files
│   └── ...
└── src/
    ├── routes/
    │   └── products.js             ← Handles uploads
    └── index.js                    ← Serves uploads folder
```

---

## NEW: Media Helper Utility

### Available Functions:

#### `getImageUrl(imageUrl: string): string`
Converts relative image paths to full URLs
```javascript
getImageUrl('/uploads/image.jpg')  
// → 'http://localhost:5000/uploads/image.jpg'
```

#### `getVideoUrl(videoUrl: string): string | null`
Handles video URL conversion and embedding
```javascript
getVideoUrl('https://youtube.com/watch?v=abc123')
// → 'https://www.youtube.com/embed/abc123'
```

#### `handleImageError(event: SyntheticEvent)`
Shows placeholder on image load failure
```javascript
<img onError={handleImageError} />
```

#### `validateImageFile(file: File): {valid: boolean, error?: string}`
Validates image before upload
```javascript
const validation = validateImageFile(file);
if (!validation.valid) {
  alert(validation.error); // Max 10MB, JPEG/PNG/WebP/GIF only
}
```

#### `validateVideoFile(file: File): {valid: boolean, error?: string}`
Validates video before upload
```javascript
const validation = validateVideoFile(file);
if (!validation.valid) {
  alert(validation.error); // Max 100MB, MP4/WebM/OGG only
}
```

---

## Browser Console Debug Tips

### Check what URLs are being requested:
```javascript
// In browser console:
document.querySelectorAll('img').forEach(img => console.log(img.src));
document.querySelectorAll('video').forEach(video => console.log(video.src));
```

### Clear browser cache:
- Chrome: Ctrl+Shift+Delete
- Firefox: Ctrl+Shift+Delete  
- Safari: Cmd+Option+E

### Check if server is running:
```bash
# In another terminal:
curl http://localhost:5000/api/health
# Should return: {"ok": true}
```

---

## Production Deployment Notes

For production (moraajewles.com):

1. Update CORS origin in `server/src/index.js`:
```javascript
origin: ['https://moraajewles.com']
```

2. Update `VITE_API_BASE` to production API URL:
```
VITE_API_BASE=https://api.moraajewles.com
```

3. Ensure uploads folder has write permissions:
```bash
chmod -R 755 server/uploads/
```

4. Consider using cloud storage (AWS S3, Cloudinary) for scale

---

## Next Steps

1. ✅ Test image upload with test images
2. ✅ Test video upload (or paste YouTube URL)
3. ✅ Verify images display on product pages
4. ✅ Check network tab to confirm URLs are correct
5. ⭐ If still issues, provide browser console errors

**All code changes are complete!** The system is ready to handle uploaded images and videos.
