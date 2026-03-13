# Quick Start Guide - Inventory & Reviews System

## Getting Started

### 1. Start the Backend Server
```powershell
cd server
npm install  # if not already done
npm run dev
# Server will be running on http://localhost:5000
```

### 2. Start the Frontend
```powershell
# In a new terminal, in the root directory
npm install  # if not already done
npm run dev
# Frontend will be running on http://localhost:5173
```

---

## Testing Inventory System

### View Inventory on Product Pages
1. Go to http://localhost:5173/products
2. You'll see stock status on each product card
3. Example: "✓ In Stock (5)" or "Out of Stock"
4. Click a product to see more details

### Check Stock on Product Detail Page
1. Click on any product from the products page
2. Look for the stock status near the price:
   - Green checkmark + quantity = In stock
   - Red alert icon = Out of stock
3. Cannot add out-of-stock items to cart

### Test API Endpoints (Using curl or Postman)

**Get Product Stock:**
```bash
curl http://localhost:5000/api/inventory/product/{productId}
```

Replace `{productId}` with an actual product ID from your database.

**Update Stock (Admin Only):**
```bash
curl -X PUT http://localhost:5000/api/inventory/product/{productId} \
  -H "Authorization: Bearer {adminToken}" \
  -H "Content-Type: application/json" \
  -d "{\"stock\": 20}"
```

**Get Low Stock Products (Admin Only):**
```bash
curl -H "Authorization: Bearer {adminToken}" \
  "http://localhost:5000/api/inventory/low-stock/list?threshold=5"
```

---

## Testing Reviews & Ratings System

### View Reviews on Product Page
1. Visit a product detail page (http://localhost:5173/product/{id})
2. Scroll to the bottom to find "Customer Reviews & Ratings" section
3. You'll see:
   - Average rating with stars
   - Rating distribution chart (5★ 4★ 3★ 2★ 1★)
   - Total review count
   - Individual reviews (currently empty if no approved reviews)
   - "Write a Review" button

### Submit a Review
1. Click "Write a Review" button
2. Select your star rating (click stars to select)
3. Enter a review title
4. Write your review comment
5. Click "Submit Review"
6. You'll see a message: "Review submitted successfully! It will appear after admin approval."

**Note:** You must be logged in to submit a review.

### View Reviews
1. Reviews appear in the list once admin approves them
2. Sort reviews by:
   - Newest First (default)
   - Highest Rating
   - Lowest Rating
   - Most Helpful
3. Click "Helpful (N)" to mark a review as helpful

### Test API Endpoints

**Get All Reviews for a Product:**
```bash
curl "http://localhost:5000/api/reviews/product/{productId}"
```

**Get Reviews sorted by highest rating:**
```bash
curl "http://localhost:5000/api/reviews/product/{productId}?sort=highest"
```

**Submit a Review (Authenticated):**
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer {userToken}" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"{productId}\",
    \"rating\": 5,
    \"title\": \"Amazing product!\",
    \"comment\": \"This is the best purchase I've made.\"
  }"
```

**Mark Review as Helpful:**
```bash
curl -X PUT "http://localhost:5000/api/reviews/{reviewId}/helpful"
```

### Admin Review Moderation
1. Get pending reviews (need admin token):
```bash
curl -H "Authorization: Bearer {adminToken}" \
  http://localhost:5000/api/reviews/admin/pending
```

2. Approve a review:
```bash
curl -X PUT http://localhost:5000/api/reviews/admin/{reviewId}/approve \
  -H "Authorization: Bearer {adminToken}"
```

3. Reject a review:
```bash
curl -X PUT http://localhost:5000/api/reviews/admin/{reviewId}/reject \
  -H "Authorization: Bearer {adminToken}"
```

---

## Getting Admin Token

### 1. Create an Admin User (First Time)
Update a user in MongoDB to be admin:
```javascript
db.users.updateOne(
  { email: "admin@moraa.com" },
  { $set: { isAdmin: true } }
)
```

### 2. Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"admin@moraa.com\",
    \"password\": \"your_password\"
  }"
```

You'll get back a token - use this in the Authorization header.

---

## Testing Scenario - Complete Workflow

### Scenario: Customer Reviews a Product

1. **Product Owner Updates Stock:**
   - Admin updates product stock to 5 units
   
2. **Customer Views Product:**
   - Sees "✓ In Stock (5)" badge
   - Clicks to view product details
   - Sees rating section (currently shows "No ratings")
   
3. **Customer Submits Review:**
   - Clicks "Write a Review"
   - Gives 5 stars
   - Title: "Excellent quality!"
   - Comment: "Beautiful piece, highly recommend"
   - Clicks Submit
   - Sees: "Review submitted successfully!"
   
4. **Admin Approves Review:**
   - Uses `/api/reviews/admin/pending` to check pending reviews
   - Approves the review with `/api/reviews/admin/{reviewId}/approve`
   - Product's `averageRating` is updated to 5.0
   - Product's `reviewCount` is updated to 1
   
5. **Other Customers See Review:**
   - Visit same product page
   - See "5.0" average rating with stars
   - See "1 review" count
   - See the published review in the list
   - Can mark it helpful

---

## Common Issues & Solutions

### "Stock not showing"
- Ensure products have `stock` field in database
- Run: `db.products.updateMany({}, { $set: { stock: 0 } })`

### "Reviews not loading"
- Check server console for errors
- Ensure backend is running on port 5000
- Check browser console (F12) for API errors

### "Cannot submit review"
- Must be logged in
- Wait for admin approval (status: pending)
- Cannot review twice (one review per user per product)

### "Low stock shows but inventory doesn't match"
- Check if `stock` field is properly updated
- Verify database synchronization

---

## Database Verification

### Check Product Stock
```javascript
db.products.findOne("product name").stock
```

### Check Reviews
```javascript
db.reviews.find({ productId: ObjectId("...") })
```

### Check Product Rating Stats
```javascript
db.products.findOne(
  { name: "product name" },
  { averageRating: 1, reviewCount: 1 }
)
```

---

## Next Steps

Now that inventory and reviews are working:

1. **Integrate with Cart/Checkout** - Reduce stock when order is placed
2. **Create Admin Dashboard** - UI for managing inventory and reviews
3. **Add Email Notifications** - Notify admins of new reviews
4. **Implement Review Images** - Allow photo uploads with reviews

See `INVENTORY_REVIEWS_GUIDE.md` for detailed API documentation.

---

## Need Help?

- Check server console for error messages
- Review API response status codes
- Test endpoints individually with curl
- Check MongoDB data directly
- Reference the INVENTORY_REVIEWS_GUIDE.md for complete API docs
