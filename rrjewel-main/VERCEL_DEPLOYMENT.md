# Vercel Deployment Guide

## Environment Variables Setup

Add the following to your Vercel Project Settings > Environment Variables:

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/rrjewel
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@moraa.com
ADMIN_PASSWORD=changeme
VITE_API_BASE=https://your-project.vercel.app
```

## Deployment Checklist

- [ ] MongoDB Atlas URI is set (for production)
- [ ] JWT_SECRET is set to a strong random value
- [ ] Environment variables are configured in Vercel
- [ ] Build command is set to: `npm install && npm run build`
- [ ] Output directory is set to: `dist`
- [ ] Node version is 18+ LTS
- [ ] .env files are in .gitignore (they should not be committed)

## API Routes

The following API endpoints are available:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/chat` - Send a chat message (requires authentication)
- `GET /api/chat` - Get user's chat history (requires authentication)

## Notes

- Use MongoDB Atlas (cloud MongoDB) for production
- Keep JWT_SECRET secure and change from default
- Frontend is served from `/dist` with client-side routing fallback
- API routes are serverless functions in `/api` directory
