# Cloudinary Integration Setup

## Configuration Files Updated

1. **Environment Variables**
   - Added to `server/.env.example`:
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
   - Added to `.env.example`:
     - `VITE_CLOUDINARY_CLOUD_NAME` (for frontend, if needed)

2. **Backend Config**
   - Created `/server/src/config/cloudinary.js` - Initializes Cloudinary with environment variables

3. **Backend Routes Updated**
   - `/server/src/routes/products.js` - Now uses Cloudinary for product images
   - `/server/src/routes/videos.js` - Now uses Cloudinary for video uploads

## Dependencies Installed

- `cloudinary` - Cloudinary SDK
- `multer-storage-cloudinary` - Multer storage engine for Cloudinary

## How It Works

### Products (Images)
- **Folder**: `moyaa-products`
- **Accepted Formats**: jpg, jpeg, png, gif, webp, mp4, webm, mov
- **Behavior**: When files are uploaded via POST/PUT, they go directly to Cloudinary and secure_url is stored in DB

### Videos
- **Folder**: `moyaa-videos`
- **Resource Type**: video
- **Accepted Formats**: mp4, webm, mov, avi, mkv
- **Behavior**: Video files are uploaded to Cloudinary and secure_url is stored

## Frontend Usage

No changes needed! The frontend already:
- Receives Cloudinary URLs from the API
- Displays images/videos directly from Cloudinary URLs
- Benefits from Cloudinary's automatic optimization and CDN

## Next Steps

1. Add your Cloudinary credentials to `.env` file:
   - Copy from `.env.example`
   - Fill in your actual credentials from Cloudinary dashboard

2. Test with a product upload:
   - Images will now upload to Cloudinary
   - URLs will be stored in MongoDB

3. (Optional) Remove old local uploads folder if you no longer need them:
   - `/server/uploads/` - Can be deleted after migrating existing products
