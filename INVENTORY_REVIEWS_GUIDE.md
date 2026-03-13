# Inventory Management & Reviews System Documentation

## Overview
This document describes the new Inventory Management and Reviews & Ratings systems added to the RRJewel e-commerce platform.

---

## 1. INVENTORY MANAGEMENT SYSTEM

### Features
- **Stock Tracking**: Track available stock for each product
- **SKU Support**: Optional SKU codes for products
- **Stock Status**: Display in-stock/out-of-stock status on product pages
- **Low Stock Alerts**: Admin alert system for products running low on inventory
- **Stock Reduction**: Automatic stock reduction when items are ordered
- **Stock Restoration**: Restore stock when orders are cancelled

### Database Schema (Product Model)

```javascript
{
  // ... existing fields ...
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, unique: true, sparse: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 }
}
```

### API Endpoints

#### Get Product Inventory
```
GET /api/inventory/product/:id
Response: {
  productId: ObjectId,
  name: string,
  stock: number,
  sku: string,
  inStock: boolean
}
```

#### Get All Inventory (Admin Only)
```
GET /api/inventory
Headers: Authorization: Bearer {token}
Response: [{
  productId: ObjectId,
  name: string,
  sku: string,
  stock: number,
  price: number,
  status: string,
  lowStock: boolean
}]
```

#### Update Inventory (Admin Only)
```
PUT /api/inventory/product/:id
Headers: Authorization: Bearer {token}
Body: { stock: number }
Response: {
  message: string,
  product: { productId, name, stock, sku }
}
```

#### Reduce Stock (When Item Added to Order)
```
PUT /api/inventory/reduce/:id
Headers: Authorization: Bearer {token}
Body: { quantity: number }
Response: {
  message: string,
  productId: ObjectId,
  newStock: number
}
```

#### Restore Stock (When Order Cancelled)
```
PUT /api/inventory/restore/:id
Headers: Authorization: Bearer {token}
Body: { quantity: number }
Response: {
  message: string,
  productId: ObjectId,
  newStock: number
}
```

#### Get Low Stock Products (Admin Only)
```
GET /api/inventory/low-stock/list?threshold=5
Headers: Authorization: Bearer {token}
Response: {
  threshold: number,
  count: number,
  products: [{name, stock, sku, price, category}]
}
```

### Frontend Implementation

#### AllProducts Page
- Shows stock status under each product: "✓ In Stock (5)" or "Out of Stock"
- Disables "Add to Cart" button when stock is 0
- Shows product rating if available

#### ProductDetail Page
- Displays stock count with status icon (green checkmark for in stock, red alert for out of stock)
- Shows product rating and review count
- Prevents quantity selection exceeding available stock (in cart logic)

---

## 2. REVIEWS & RATINGS SYSTEM

### Features
- **Star Ratings**: 1-5 star rating system
- **Text Reviews**: Customers can write detailed review titles and comments
- **Review Moderation**: Admin approval system for review visibility
- **Rating Aggregation**: Automatic calculation of average ratings
- **Helpful Voting**: Users can mark reviews as helpful
- **Rating Distribution**: Visual breakdown of rating distribution
- **Review Sorting**: Sort by newest, highest rated, lowest rated, or most helpful
- **Purchase Verification**: Flag verified purchases (optional)

### Database Schema (Review Model)

```javascript
{
  productId: ObjectId (required),
  userId: ObjectId (required),
  userName: string (required),
  userEmail: string (required),
  rating: number (1-5, required),
  title: string (required),
  comment: string (required),
  helpful: number (default: 0),
  images: [string],
  verified: boolean (default: false),
  status: enum ['pending', 'approved', 'rejected'] (default: 'pending'),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### API Endpoints

#### Get Reviews for Product
```
GET /api/reviews/product/:productId?sort=newest&rating=5
Response: {
  reviews: [{
    id: string,
    userName: string,
    rating: number,
    title: string,
    comment: string,
    helpful: number,
    createdAt: timestamp
  }],
  totalReviews: number,
  ratingDistribution: {
    5: number,
    4: number,
    3: number,
    2: number,
    1: number
  }
}
```

#### Get Single Review
```
GET /api/reviews/:id
Response: (Review object)
```

#### Create Review (Authenticated Users Only)
```
POST /api/reviews
Headers: Authorization: Bearer {token}
Body: {
  productId: string,
  rating: number (1-5),
  title: string,
  comment: string
}
Response: {
  message: string,
  review: (Review object)
}
```

#### Update Review (User Can Update Own Review)
```
PUT /api/reviews/:id
Headers: Authorization: Bearer {token}
Body: {
  rating?: number,
  title?: string,
  comment?: string
}
Response: {
  message: string,
  review: (Review object)
}
```

#### Delete Review (User Can Delete Own, Admin Can Delete Any)
```
DELETE /api/reviews/:id
Headers: Authorization: Bearer {token}
Response: {
  message: string
}
```

#### Mark Review as Helpful
```
PUT /api/reviews/:id/helpful
Response: {
  message: string,
  helpful: number
}
```

#### Get Pending Reviews (Admin Only)
```
GET /api/reviews/admin/pending
Headers: Authorization: Bearer {token}
Response: {
  count: number,
  reviews: [{...Review with productId populated}]
}
```

#### Approve Review (Admin Only)
```
PUT /api/reviews/admin/:id/approve
Headers: Authorization: Bearer {token}
Response: {
  message: string,
  review: (Review object)
}
```

#### Reject Review (Admin Only)
```
PUT /api/reviews/admin/:id/reject
Headers: Authorization: Bearer {token}
Response: {
  message: string,
  review: (Review object)
}
```

### Frontend Implementation

#### ProductReviews Component
Located at: `src/components/ProductReviews.tsx`

Features:
- **Rating Summary**: Shows average rating with visual star display
- **Rating Distribution Chart**: Shows breakdown of 5, 4, 3, 2, 1 star reviews
- **Review Form**: Authenticated users can submit reviews
  - Select star rating
  - Enter review title
  - Write review comment
  - Submits with pending status
- **Reviews List**: 
  - Displays all approved reviews
  - Shows author name, date, and helpful count
  - Allows users to mark reviews as helpful
- **Sort Options**: 
  - Newest first
  - Highest rating
  - Lowest rating
  - Most helpful

#### ProductDetail Page Integration
- Imports and displays `ProductReviews` component
- Shows average rating and review count in product header
- Automatically updates reviews when new reviews are approved

---

## 3. ADMIN MANAGEMENT

### Inventory Admin Features
To view as admin:
1. Ensure user has `isAdmin: true` in database
2. Login with admin account
3. Visit `/api/inventory` endpoints to manage stock

### Reviews Admin Moderation
To moderate reviews:
1. Login as admin
2. Access `/api/reviews/admin/pending` to see pending reviews
3. Use `/api/reviews/admin/:id/approve` to approve
4. Use `/api/reviews/admin/:id/reject` to reject

---

## 4. DATABASE SEED DATA (Optional)

To add initial inventory data, update the seedAdmin script or run:

```javascript
// Example: Add stock to existing products
db.products.updateMany({}, { $set: { stock: 10, sku: "" } });

// Add average ratings
db.products.updateMany({}, { $set: { averageRating: 0, reviewCount: 0 } });
```

---

## 5. INTEGRATION WITH EXISTING FEATURES

### Cart & Checkout (TODO)
When you implement order checkout:
```javascript
// Reduce stock when order is placed
await axios.put(`/api/inventory/reduce/${productId}`, 
  { quantity: cartItem.quantity },
  { headers: { Authorization: `Bearer ${token}` } }
);

// Restore stock if user cancels order
await axios.put(`/api/inventory/restore/${productId}`, 
  { quantity: cartItem.quantity },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

---

## 6. VERIFICATION CHECKLIST

- ✅ Product model updated with stock and rating fields
- ✅ Review model created
- ✅ Inventory API routes implemented
- ✅ Reviews API routes implemented
- ✅ Routes registered in server/src/index.js
- ✅ ProductReviews component created
- ✅ ProductDetail page updated with reviews and stock display
- ✅ AllProducts page updated with inventory status
- ⚠️ Cart/Checkout integration (TODO)
- ⚠️ Admin dashboard UI for inventory management (TODO)
- ⚠️ Admin dashboard UI for review moderation (TODO)

---

## 7. TESTING

### Test Inventory
```bash
# Get product inventory
curl http://localhost:5000/api/inventory/product/{productId}

# Update inventory (as admin)
curl -X PUT http://localhost:5000/api/inventory/product/{productId} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"stock": 15}'
```

### Test Reviews
```bash
# Get reviews for product
curl http://localhost:5000/api/reviews/product/{productId}

# Submit review (as authenticated user)
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "{productId}",
    "rating": 5,
    "title": "Excellent product",
    "comment": "This product is amazing!"
  }'
```

---

## 8. NEXT STEPS

1. **Create Admin Dashboard**
   - Inventory management interface
   - Review moderation interface
   - Low stock alerts

2. **Integrate with Checkout**
   - Reduce stock on order placement
   - Handle stock validation during checkout

3. **Enhanced Features**
   - Review images/photos
   - Verified purchase badge
   - Email notifications for reviews
   - Review filtering by rating
   - Customer Q&A section

4. **Analytics**
   - Review sentiment analysis
   - Inventory trend reports
   - Best-selling products by inventory

---

## Support
For issues or questions, refer to the API endpoints documentation above or check the server logs at `server/src/routes/inventory.js` and `server/src/routes/reviews.js`.
