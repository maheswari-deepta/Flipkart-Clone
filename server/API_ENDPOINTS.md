# Flipkart Clone API — Postman Testing Guide

Base URL: `http://localhost:5000`

---

## All Endpoints (13)

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/api/products` | List products (`?search=`, `?category=`, `?limit=`) |
| 2 | GET | `/api/products/:id` | Product detail with reviews |
| 3 | GET | `/api/categories` | List categories |
| 4 | GET | `/api/cart` | Cart summary with totals |
| 5 | POST | `/api/cart` | Add/increment cart item |
| 6 | PUT | `/api/cart/:itemId` | Update cart item quantity |
| 7 | DELETE | `/api/cart/:itemId` | Remove cart item |
| 8 | GET | `/api/wishlist` | Wishlisted products |
| 9 | POST | `/api/wishlist` | Add product to wishlist |
| 10 | DELETE | `/api/wishlist/:productId` | Remove from wishlist |
| 11 | POST | `/api/orders` | Place order from cart |
| 12 | GET | `/api/orders` | Order history (newest first) |
| 13 | GET | `/api/orders/:id` | Order detail |

---

## Product Response Fields

All product responses include these scalar fields:

| Field | Type | Description |
|-------|------|-------------|
| `sku` | string | Unique product SKU |
| `weight` | number | Weight (kg) |
| `width` | number | Width (cm) |
| `height` | number | Height (cm) |
| `depth` | number | Depth (cm) |
| `warranty` | string | Warranty description |
| `shippingInfo` | string | Shipping estimate |
| `availability` | string | e.g. `"In Stock"` |
| `returnPolicy` | string | Return policy text |
| `minOrderQty` | number | Minimum quantity per cart line |
| `tags` | string[] | Product tags |

### List vs detail

- **`GET /api/products`** — includes `_count: { reviews: N }` per product (no review bodies)
- **`GET /api/products/:id`** — includes full `reviews[]` array:

```json
{
  "id": 1,
  "rating": 4,
  "comment": "Very satisfied!",
  "reviewerName": "Lucas Gordon",
  "productId": 1,
  "createdAt": "2026-06-13T..."
}
```

`reviewerEmail` is never returned in API responses.

### Search

`?search=` matches (case-insensitive): product name, category name, brand, SKU, and exact tag (lowercase).

---

## End-to-End Test Flow

Run in order to test the full purchase lifecycle:

```bash
# 1. Check product detail (includes reviews, sku, tags)
curl "http://localhost:5000/api/products/1"

# 2. Add product to cart (quantity must meet minOrderQty)
curl -X POST "http://localhost:5000/api/cart" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 48}'

# 3. View cart (verify subtotal and totalItems)
curl "http://localhost:5000/api/cart"

# 4. Place order
curl -X POST "http://localhost:5000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "shippingName": "John Doe",
    "shippingPhone": "9876543210",
    "shippingAddress": "123 Main Street",
    "shippingCity": "Bangalore",
    "shippingPincode": "560001"
  }'

# 5. Verify cart is empty after checkout
curl "http://localhost:5000/api/cart"

# 6. View order history
curl "http://localhost:5000/api/orders"

# 7. View order detail (use id from step 4 response)
curl "http://localhost:5000/api/orders/1"

# 8. Verify stock decremented
curl "http://localhost:5000/api/products/1"
```

---

## Individual Endpoint Reference

### Health

```bash
curl "http://localhost:5000/"
```

### Products

```bash
curl "http://localhost:5000/api/products"
curl "http://localhost:5000/api/products?search=beauty"
curl "http://localhost:5000/api/products?search=BEA-ESS"
curl "http://localhost:5000/api/products?category=Beauty"
curl "http://localhost:5000/api/products/1"
curl "http://localhost:5000/api/products/abc"    # 400
curl "http://localhost:5000/api/products/999"    # 404
```

### Categories

```bash
curl "http://localhost:5000/api/categories"
```

### Cart

```bash
curl "http://localhost:5000/api/cart"

curl -X POST "http://localhost:5000/api/cart" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 48}'

curl -X PUT "http://localhost:5000/api/cart/ITEM_ID" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 50}'

curl -X DELETE "http://localhost:5000/api/cart/ITEM_ID"
```

### Wishlist

```bash
curl "http://localhost:5000/api/wishlist"

curl -X POST "http://localhost:5000/api/wishlist" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}'

curl -X DELETE "http://localhost:5000/api/wishlist/1"
```

### Orders

```bash
curl -X POST "http://localhost:5000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "shippingName": "John Doe",
    "shippingPhone": "9876543210",
    "shippingAddress": "123 Main Street",
    "shippingCity": "Bangalore",
    "shippingPincode": "560001"
  }'

curl "http://localhost:5000/api/orders"
curl "http://localhost:5000/api/orders/1"
curl "http://localhost:5000/api/orders/abc"        # 400
curl "http://localhost:5000/api/orders/999"        # 404
```

---

## Routing Audit

All controller functions are wired to routes and mounted in `index.js`:

| Controller | Function | Route |
|------------|----------|-------|
| productController | getProducts | GET /api/products |
| productController | getProductById | GET /api/products/:id |
| categoryController | getCategories | GET /api/categories |
| cartController | getCart | GET /api/cart |
| cartController | addToCart | POST /api/cart |
| cartController | updateCartItem | PUT /api/cart/:itemId |
| cartController | removeFromCart | DELETE /api/cart/:itemId |
| wishlistController | getWishlist | GET /api/wishlist |
| wishlistController | addToWishlist | POST /api/wishlist |
| wishlistController | removeFromWishlist | DELETE /api/wishlist/:productId |
| orderController | placeOrder | POST /api/orders |
| orderController | getOrders | GET /api/orders |
| orderController | getOrderById | GET /api/orders/:id |

No orphaned controller functions or unmounted routes.

---

## Common Error Responses

| Status | Example |
|--------|---------|
| 400 | `{ "error": "Invalid product id" }` |
| 400 | `{ "error": "Insufficient stock" }` |
| 400 | `{ "error": "Minimum order quantity is 48" }` |
| 400 | `{ "error": "Insufficient stock for: Product Name" }` |
| 400 | `{ "error": "Cart is empty" }` |
| 400 | `{ "error": "shippingName is required" }` |
| 404 | `{ "error": "Product not found" }` |
| 404 | `{ "error": "Cart item not found" }` |
| 404 | `{ "error": "Order not found" }` |
| 500 | `{ "error": "Internal server error" }` |
