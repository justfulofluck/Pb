# Auth, Checkout & Utility Pages SEO Audit — PinoBite

**Components:** `CheckoutPage.tsx`, `Dashboard.tsx`, `AdminLoginPage.tsx`, `AdminDashboard.tsx`, `VisitorFormPage.tsx`, `SharedWishlistPage.tsx`  
**Routes:** `/checkout`, `/dashboard`, `/admin/login`, `/admin`, `/forms/{formId}`, `/wishlist/shared/{token}`  
**Audit Date:** 2026-05-22

---

## Important Note

These pages are **user-specific or admin-only** and generally should be **blocked from search engine indexing** via `noindex` meta tag or `robots.txt`. However, the audit below covers what exists.

---

## CHECKOUT PAGE (`/checkout`)

| Element | Status | Details |
|---------|--------|---------|
| Title | ⚠️ Generic | `Checkout | PinoBite` |
| Meta Description | ❌ Missing | — |
| H1 | ❌ Missing | No H1 on checkout page |
| H2-H6 | ❌ Missing | Uses `<h3>` for "Contact Information", "Shipping Address", etc. — skips H2 |
| Content | ✅ Rich | Order summary, form fields, payment option |
| Noindex | ❌ Not Set | Should be noindex to prevent cart URLs in search |
| Canonical | ❌ Missing | — |
| OG Tags | ❌ Missing | — |

**Recommendations:**
- Add `<meta name="robots" content="noindex, nofollow">` 
- Add `<h1>` — `Checkout | PinoBite` (hidden visually if needed)
- Fix heading hierarchy: H1 → H2 instead of `<h3>` for section titles
- Title: `Secure Checkout | PinoBite`

---

## DASHBOARD (`/dashboard`)

| Element | Status |
|---------|--------|
| Title | ⚠️ Generic: `My Dashboard | PinoBite` |
| Meta Description | ❌ Missing |
| Noindex | ❌ Not Set — must be `noindex` |
| H1 | ❌ Missing — uses `<h2>` "Welcome back, {name}" |
| H2 | ✅ Good for tab content |

**Recommendations:**
- Add `noindex, nofollow` meta tag
- Add `<h1>` with "My Dashboard | PinoBite"
- Add hidden meta description for dashboard context

---

## ADMIN LOGIN (`/admin/login`)

| Element | Status |
|---------|--------|
| Title | ⚠️ Generic: `Admin Login | PinoBite` |
| Meta Description | ❌ Missing |
| Noindex | ❌ Not Set — must be `noindex` |
| H1 | ❌ Missing — no visible H1 (uses logo + "Internal Team Access Portal") |
| Content | ✅ Form with email, password, password reset flow |

**Recommendations:**
- Add `noindex, nofollow` — critical
- Add `<h1>` (hidden) for accessibility

---

## ADMIN DASHBOARD (`/admin`)

| Element | Status |
|---------|--------|
| Title | ⚠️ Generic per tab: "Command Center", "Inventory Management", etc. via `getPageTitle()` |
| Meta Description | ❌ Missing |
| Noindex | ❌ Not Set — must be `noindex` |
| H1 | ❌ Missing — page title is `<h2>` in header |
| Content | ✅ Full admin functionality |

**Recommendations:**
- Add `noindex, nofollow` — critical for security
- Proper heading hierarchy

---

## VISITOR FORM (`/forms/{formId}`)

| Element | Status |
|---------|--------|
| Title | ❌ Not Set — only `Visitor Form | PinoBite` via fallback |
| Meta Description | ❌ Missing |
| Noindex | ❌ Not Set — should be indexable if public forms |
| H1 | ✅ Present: form title in header |
| Content | ✅ Registration form with validation |

**Recommendations:**
- Dynamic title: `{form.eventName} Registration | PinoBite`
- Add meta description for the event
- If forms are public/temporary, consider dynamic `noindex` for expired forms

---

## SHARED WISHLIST (`/wishlist/shared/{token}`)

| Element | Status |
|---------|--------|
| Title | ❌ Not Set — fallback `Shared Wishlist | PinoBite` |
| Meta Description | ❌ Missing |
| Noindex | ❌ Not Set — should be indexable if sharing is public |
| H1 | ✅ Good: `{userName}'s Wishlist` |
| H2 | ⚠️ Missing after H1 |
| Image Alt | ✅ Good: `alt={product.name}` |
| Content | ✅ Product grid with add-to-cart |

**Recommendations:**
- Dynamic title: `{userName}'s Wishlist | PinoBite`
- Add meta description: `Browse {userName}'s shared wishlist on PinoBite. Shop their favorite healthy snacks.`
- Add `noindex` if wishlist tokens should be private
- Add OG tags for social sharing (wishlists are often shared via social)

---

## 2. Indexation Strategy Summary

| Page | Recommended Indexation | Rationale |
|------|----------------------|-----------|
| `/checkout` | ❌ Noindex | Transactional page, no SEO value |
| `/dashboard` | ❌ Noindex | User-specific private data |
| `/admin/login` | ❌ Noindex | Admin portal |
| `/admin` | ❌ Noindex | Admin portal |
| `/forms/{formId}` | ⚠️ Dynamic | Index if public events, noindex if expired |
| `/wishlist/shared/{token}` | ❌ Noindex | User-generated content, potential duplicate issues |

---

## 3. Score Summary

| Page | On-Page | Technical | Overall |
|------|---------|-----------|---------|
| Checkout | 3/10 | 3/10 | 3/10 |
| Dashboard | 3/10 | 3/10 | 3/10 |
| Admin Login | 2/10 | 3/10 | 2.5/10 |
| Admin Dashboard | 2/10 | 3/10 | 2.5/10 |
| Visitor Form | 4/10 | 3/10 | 3.5/10 |
| Shared Wishlist | 4/10 | 3/10 | 3.5/10 |
