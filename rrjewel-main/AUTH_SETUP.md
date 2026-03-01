# Authentication Setup (localStorage-based)

## ✅ What Changed
- **Removed**: JWT tokens and Bearer auth headers
- **Added**: Simple localStorage-based authentication
- **Backend**: Simple user registration/login (no password hashing/validation by backend)
- **Frontend**: Stores user data in localStorage and restores on page load

## 🚀 Quick Start

### 1. **Start MongoDB** (if not running)
```powershell
mongo
```

### 2. **Install & Start Backend Server**
```powershell
cd server
npm install
npm run dev
```
Server runs on: **http://localhost:5000**

### 3. **Start Frontend** (in another terminal)
```powershell
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

### 4. **Test Login**

**Sign Up:**
- Click user icon (👤) in header → "Create Account"
- Enter any email and password
- Click "Create Account"

**Sign In:**
- Click user icon → "Sign In"
- Use your registered credentials

**Admin Access:**
- Pre-configured admin: `admin@moraa.com` / `changeme`
- After login, Admin button appears in header
- Admin can manage: Products, Videos, Banners, Coupons

### 5. **Logout**
- Click user icon when signed in
- Confirm logout

## 📁 Key Files Modified

**Backend:**
- `server/src/routes/auth.js` - Simplified (no JWT/bcrypt)
- `server/src/routes/*.js` - Removed auth middleware requirements
- `server/.env` - Removed JWT_SECRET

**Frontend:**
- `src/context/AppContext.tsx` - Removed token state, uses localStorage
- `src/components/SignInModal.tsx` - Stores user in localStorage  
- `src/components/ShowcaseVideos.tsx` - Removed Bearer auth headers
- `src/pages/Admin.tsx` - Removed auth headers from API calls
- `src/components/Header.tsx` - Uses LOGOUT action

## 💾 Data Storage

**localStorage keys:**
- `rr_user` - Current logged-in user
- `rr_products` - Product list
- `rr_videos` - Showcase videos
- `rr_banners` - Banners/messages
- `rr_coupons` - Coupon codes

**Database (MongoDB):**
- User collection - Email/password storage
- All admin data persisted per MongoDB models

## 🔐 Note
This setup is suitable for development/demo. For production:
- Add proper password hashing (bcryptjs)
- Implement JWT tokens with expiration
- Add HTTPS requirement
- Add rate limiting on auth endpoints
- Validate inputs server-side
