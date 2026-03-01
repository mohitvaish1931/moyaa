# MongoDB Setup Guide

## Local MongoDB Setup (Already Installed)

### Start MongoDB Server

**Option 1: Using Command Line**
```powershell
# Start MongoDB service (if installed as Windows Service)
net start MongoDB

# OR directly run mongod
mongod --dbpath "C:\data\db"
```

**Option 2: Using MongoDB Compass (GUI Tool)**
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Install and open it
3. Click "Connect" to connect to local MongoDB (default: `mongodb://localhost:27017`)
4. You can manage databases and collections through the GUI

### Verify MongoDB is Running
```powershell
mongo --eval "db.version()"
```

## Environment Variables for Backend

Add to `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/rrjewel
PORT=5000
ADMIN_EMAIL=admin@moraa.com
ADMIN_PASSWORD=changeme
NODE_ENV=development
```

Add to root `.env`:
```env
VITE_API_BASE=http://localhost:5000
MONGO_URI=mongodb://localhost:27017/rrjewel
```

## Using MongoDB Compass

1. **Download**: https://www.mongodb.com/try/download/compass
2. **Connect**: 
   - Connection string: `mongodb://localhost:27017/rrjewel`
   - Click "Connect"
3. **View Data**:
   - Left sidebar shows databases
   - Click `rrjewel` to see collections (User, Product, Chat, etc.)
   - Click any collection to view documents

## Database Collections

The app uses these MongoDB collections:
- **User** - User accounts with email/password
- **Product** - Jewelry products
- **Banner** - Announcements
- **Coupon** - Discount codes
- **Video** - Showcase videos
- **Chat** - User messages

## Starting the Application

```powershell
# Terminal 1: Ensure MongoDB is running
net start MongoDB

# Terminal 2: Start backend server
cd server
npm install  # only first time
npm run dev

# Terminal 3: Start frontend
npm install  # only first time
npm run dev
```

**Backend**: http://localhost:5000
**Frontend**: http://localhost:5173

## Troubleshooting

### MongoDB service won't start
```powershell
# Check if MongoDB is installed
Get-Service MongoDB

# Manually start MongoDB
mongod --dbpath "C:\data\db"
```

### Connection refused
- Ensure MongoDB is running or MongoDB service is started
- Check `MONGO_URI` in `.env` files

### Can't connect in Compass
- Make sure MongoDB daemon (`mongod`) is running
- Default connection: `mongodb://localhost:27017`

## Reset Database

To clear all data and start fresh:
```powershell
# In MongoDB Compass: Right-click database > Drop Database
# OR use mongo shell:
mongo
use rrjewel
db.dropDatabase()
```
