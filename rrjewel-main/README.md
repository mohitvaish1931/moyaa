# RRJewel - Jewelry E-Commerce Platform

A full-stack jewelry e-commerce application with Next.js, React, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (installed locally or use MongoDB Atlas cloud)
- npm or yarn

### 1. Setup MongoDB

See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed instructions on:
- Starting MongoDB locally
- Connecting with MongoDB Compass
- Setting up environment variables

**Quick Start:**
```powershell
# Start MongoDB (if installed as service)
net start MongoDB

# OR start MongoDB manually
mongod --dbpath "C:\data\db"
```

### 2. Configure Environment Variables

**Root directory (.env):**
```env
VITE_API_BASE=http://localhost:5000
MONGO_URI=mongodb://localhost:27017/rrjewel
```

**Server directory (server/.env):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rrjewel
ADMIN_EMAIL=admin@moraa.com
ADMIN_PASSWORD=changeme
NODE_ENV=development
```

### 3. Install & Run

**Terminal 1 - Backend:**
```powershell
cd server
npm install
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

## 📁 Project Structure

```
rrjewel/
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/        # MongoDB schemas (User, Product, Chat, etc.)
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── index.js       # Server entry point
│   └── .env               # Backend environment variables
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── context/          # React context (AppContext)
│   └── App.tsx           # Main app file
├── models/               # Mongoose models (TypeScript)
├── lib/                  # Utilities (MongoDB connection)
├── api/                  # Next.js API routes (login, register, chat)
└── .env                  # Frontend environment variables
```

## 🗄️ Database Collections

- **Users** - User accounts with hashed passwords
- **Products** - Jewelry items (bracelets, earrings, necklaces)
- **Videos** - Showcase/promotional videos
- **Banners** - Site banners/announcements
- **Coupons** - Discount codes
- **Chats** - User messages and support tickets

## 🔐 Authentication

**Direct Authentication (No JWT)**
- Users register with email/password
- Passwords hashed with bcryptjs
- User data stored in browser localStorage
- Admin role for product/content management

Default admin credentials:
- Email: `admin@moraa.com`
- Password: `changeme`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Chat
- `POST /api/chat` - Send message
- `GET /api/chat` - Get user's messages
- `GET /api/chat/:id` - Get specific message

### Other
- `GET /api/videos` - Get showcase videos
- `GET /api/banners` - Get banners
- `GET /api/coupons` - Get coupons

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- bcryptjs (password hashing)
- Multer (file uploads)

## 📖 Additional Documentation

- [MongoDB Setup Guide](./MONGODB_SETUP.md)
- [Authentication Setup](./AUTH_SETUP.md)
- [Server README](./server/README.md)

## 🚢 Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for Vercel deployment instructions.

## 📝 License

MIT
