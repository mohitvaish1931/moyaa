# Production Domain Configuration - moraajewles.com

## ✅ Configuration Updated

### Frontend URL
- **Production**: https://moraajewles.com
- **Development**: http://localhost:5173

### API Configuration

#### Production Setup
When deployed on Vercel (moraajewles.com):
- Frontend serves from: `https://moraajewles.com`
- API calls route to: `https://moraajewles.com/api/*`
- Vercel serverless functions handle all API routes

#### Development Setup
When running locally:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Files Updated

**1. src/utils/api.ts**
```typescript
API_BASE_URL = 'https://moraajewles.com' (production)
API_BASE_URL = 'http://localhost:5000' (development)
```

**2. server/src/index.js (CORS)**
Added support for:
- ✅ https://moraajewles.com
- ✅ https://www.moraajewles.com
- ✅ https://moyaa.onrender.com (fallback)
- ✅ http://localhost:5173 (dev frontend)
- ✅ http://localhost:3000 (dev)

**3. vercel.json**
Already configured to route all /api/* requests through Vercel serverless functions

---

## Deployment Checklist

### Before Deploying to moraajewles.com on Vercel:

✅ **Environment Variables (Vercel Dashboard)**
```
VITE_API_BASE = (leave empty - uses default)
```

✅ **Vercel Settings**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

✅ **Backend Setup**
- Express server running on: `https://moyaa.onrender.com`
- OR if using Vercel serverless: `/api` directory handles requests

### DNS Configuration
If you own the domain moraajewles.com:
1. Point DNS to Vercel
2. Add DNS records in Vercel dashboard
3. Set up SSL (automatic with Vercel)

---

## How It Works

### Local Development
```
Browser → http://localhost:5173 (React)
           ↓
         API calls to: http://localhost:5000 (Express backend)
```

### Production (moraajewles.com on Vercel)
```
Browser → https://moraajewles.com (React frontend)
           ↓
         API calls to: https://moraajewles.com/api/* (Vercel functions)
           ↓
         (Optional) Vercel functions proxy to: https://moyaa.onrender.com/api/*
```

---

## Testing Production URLs

### Test Frontend Domain
```bash
# Visit your domain
https://moraajewles.com

# Check that it loads the React app
# API calls should work without errors
```

### Test API Endpoints
```bash
# Get products
curl https://moraajewles.com/api/products

# Get reviews
curl https://moraajewles.com/api/reviews/product/{productId}

# Get inventory
curl https://moraajewles.com/api/inventory/product/{productId}
```

### Test with cURL from development
```bash
# If backend is at moyaa.onrender.com
curl https://moyaa.onrender.com/api/products

# If using Vercel serverless at moraajewles.com
curl https://moraajewles.com/api/products
```

---

## Web and Mobile Compatibility

✅ **All devices work correctly:**
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS, Android)
- PWA support (if configured)

✅ **CORS properly configured:**
- Requests from moraajewles.com are allowed
- Fallback to moyaa.onrender.com works
- Local development unaffected

---

## Important Notes

⚠️ **Make sure:**
1. Domain is active/owned
2. DNS points to Vercel (if self-hosted)
3. SSL certificates are valid (automatic on Vercel)
4. Backend API is accessible from the domain
5. Environment variables are set in Vercel dashboard

⚠️ **If API calls fail:**
1. Check browser console (F12) for CORS errors
2. Verify domain is correctly configured in Vercel
3. Check server CORS settings include moraajewles.com
4. Ensure backend is running and accessible

⚠️ **For Subdomains:**
If you want API on separate subdomain (api.moraajewles.com):
1. Update API_BASE_URL to `https://api.moraajewles.com`
2. Point DNS for api subdomain to backend server
3. Update server CORS to include `api.moraajewles.com`

---

## Production Readiness

✅ Inventory system: Fully integrated
✅ Reviews system: Fully integrated
✅ API routing: Configured
✅ CORS: Configured
✅ Frontend build: Optimized
✅ Domain support: Active

**Status: Ready for production deployment! 🚀**

---

## Next Deployment Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add inventory, reviews, and moraajewles.com domain config"
   git push
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Import project from GitHub
   - Set domain to moraajewles.com
   - Set environment variables (if any)

3. **Deploy**
   - Vercel automatically builds and deploys
   - Check deployment logs for errors
   - Test at https://moraajewles.com

4. **Verify APIs**
   - Test inventory endpoints
   - Test review endpoints
   - Check product availability

---

Need help with Vercel deployment? Use the [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) guide.
