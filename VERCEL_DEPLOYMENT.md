# Vercel Deployment Guide

This project can be seamlessly deployed to Vercel. Because Vercel is a Serverless platform, it handles the backend differently than a traditional persistent Node.js/Express server.

## Mock API vs Real Database

- **Local Development**: The `server/` directory contains an Express server connected to MongoDB. This is intended for local development or for a persistent cloud provider (like Render/Heroku).
- **Vercel Deployment**: The root `api/` directory contains Vercel Serverless Functions. These functions **return mock data** by default, allowing the frontend to be fully interactive on Vercel without requiring a database setup.

*Note: If you want to connect the Vercel Serverless Functions to your MongoDB database in the future, you can update the TS files in the `api/` folder to use `mongoose` instead of returning mock data.*

## How to Deploy on Vercel

1. **Connect your GitHub Repository**:
   - Push your code to a GitHub repository.
   - Go to [Vercel](https://vercel.com/) and create a new project.
   - Import your repository.

2. **Configure Settings**:
   - Vercel will automatically detect that this is a **Vite** project.
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   
3. **Environment Variables**:
   By default, `VITE_API_BASE` is intentionally left blank for the Vercel dashboard so that the frontend hits the relative `/api/*` endpoints hosted by Vercel Serverless.
   - Leave `VITE_API_BASE` **empty/unset** in your Vercel Project Settings.

4. **Deploy**:
   - Click "Deploy".
   - Vercel will build the React app and automatically provision the serverless functions located in the `api/` directory.

## What Has Been Fixed For Vercel Setup

- **Serverless API File Names**: Nesting inside `api/auth/login/route.ts` was corrected to `api/auth/login.ts` so Vercel can resolve it correctly.
- **Frontend API Endpoint Handling**: Adjusted `src/utils/api.ts` so it defaults to a relative API path on Vercel (`""`) but uses `localhost:5000` locally.
- **Vercel Rewrites**: Adjusted `vercel.json` routing configuration to prioritize `/api/` traffic to the serverless functions without overriding client-side routing.
