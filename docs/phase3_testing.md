# Phase 3: Testing & Verification
**Goal**: Ensure system stability, security, and user experience.

## 1. Authentication Testing
- [ ] **Signup Flow**: Create a new user "test@example.com". Check if `UserProfile` is created in Admin.
- [ ] **Login**: Log in with new user. Verify token is stored and UI updates.
- [ ] **Persistence**: Refresh page. Ensure user stays logged in.
- [ ] **Logout**: Click logout. Verify token is removed and restricted pages are inaccessible.
- [ ] **Admin Security**: Try to access `/admin-dashboard` with a non-staff user. Should fail.

## 2. Content System Testing
- [ ] **Blog Creation**: Create a blog post in Admin Panel. Verify it appears on `BlogPage`.
- [ ] **Event Creation**: Create an event. Verify it appears on specific sections.
- [ ] **Visitor Forms**:
    - [ ] Create a form in Admin.
    - [ ] Simulate a "scan" (visit the form link).
    - [ ] Submit data.
    - [ ] Check if data appears in Admin Dashboard.

## 3. Ecommerce Testing
- [ ] **Product Display**: Verify images, prices, and categories load correctly.
- [ ] **Cart**: Add items, change quantity, remove items. Check total calculation.
- [ ] **Checkout Logic**:
    - [ ] Enter invalid address -> Form error.
    - [ ] Click Pay -> Razorpay modal opens.
- [ ] **Payment Flow** (Test Mode):
    - [ ] Complete payment.
    - [ ] Verify "Success" screen.
    - [ ] Verify email received.
    - [ ] Verify Order appears in User Dashboard and Admin Panel.

## 4. Edge Cases & Polish
- [ ] **Empty States**: Check Dashboard/Orders when empty.
- [ ] **404 Handling**: Try accessing invalid URL (e.g., `/product/invalid-id`).
- [ ] **Mobile View**: Open Chrome DevTools (Mobile Mode) and test navigation.
