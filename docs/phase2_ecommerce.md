# Phase 2: Ecommerce Functionality
**Goal**: Enable product browsing, cart management, and secure payments.

## 1. Shop & Product Catalog
**Feature**: Real Product Data
- [ ] In `ShopPage.tsx`:
    - [ ] Fetch products from `GET /api/products/`.
    - [ ] Implement Categories: Clicking a category badge calls API with `?category=Name`.
    - [ ] Implement Search: Typing in search bar calls API with `?search=Term`.
    - [ ] Handle "Out of Stock" state based on `stock` field.

## 2. Order Backend
**Feature**: Razorpay Integration
- [ ] Install `razorpay` in backend (done).
- [ ] Create `api/utils.py` helper to initialize Razorpay client.
- [ ] Create endpoint `POST /api/orders/create/`:
    - [ ] Input: `items` (ids, quantities).
    - [ ] Logic: Calculate total, create Razorpay Order ID.
    - [ ] Response: `order_id`, `amount`, `currency`, `key_id`.

**Feature**: Order Verification
- [ ] Create endpoint `POST /api/orders/verify/`:
    - [ ] Input: `payment_id`, `order_id`, `signature`, `shipping_address`, `items`.
    - [ ] Logic: Verify signature with Razorpay.
    - [ ] If valid: Create `Order` and `OrderItem` in database.
    - [ ] Send confirmation email using `send_email` utility.

## 3. Checkout Frontend
**Feature**: Payment Flow via Razorpay
- [ ] In `CheckoutPage.tsx`:
    - [ ] "Complete Purchase" button triggers `create_order` API.
    - [ ] Open Razorpay Modal with returned options.
    - [ ] On Success (callback): Call `verify_order` API.
    - [ ] On Verification Success: Redirect to "Order Success" view.

## 4. Order Management
**Feature**: User History
- [ ] In `Dashboard.tsx`:
    - [ ] Fetch user's past orders from `GET /api/orders/`.
    - [ ] Display status (Processing, Shipped, Delivered).

**Feature**: Admin Fulfillment
- [ ] In `AdminDashboard.tsx` -> "Global Orders":
    - [ ] Fetch all orders.
    - [ ] Add ability to change status (e.g., "Processing" -> "Shipped").
