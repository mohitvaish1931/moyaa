# RRJewel Server

This is a simple Express + MongoDB backend for the RRJewel app.

Quick start:

1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Install dependencies and run dev server:

```bash
cd server
npm install
npm run dev
```

API endpoints:
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/videos`, `POST /api/videos`, `DELETE /api/videos/:id`
- `GET /api/banners`, `POST /api/banners`, `PUT /api/banners/:id`, `DELETE /api/banners/:id`
- `GET /api/coupons`, `POST /api/coupons`, `PUT /api/coupons/:code`, `DELETE /api/coupons/:code`
