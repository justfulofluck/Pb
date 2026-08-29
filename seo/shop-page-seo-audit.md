# Shop / Category Page SEO Audit Report — PinoBite

**Component:** `ShopPage.tsx`  
**Routes:** `/shop`, `/shop/{category}`, `/shop?search={query}`  
**Audit Date:** 2026-05-22

---

## 1. On-Page SEO

### 1.1 Page Title
| Status | Details |
|--------|---------|
| ⚠️ **Generic** | Set via JS: `Shop | PinoBite` — same for all categories/search results |

**Issues:**
- No dynamic title for category pages (e.g., "Peanut Butter" should have "Buy Peanut Butter Online | PinoBite")
- Search result pages show generic title even when searching specific products

**Recommendation:** Make title dynamic per category/search:
- Category: `{Category} | Shop Online | PinoBite`
- Search: `Search results for "{query}" | PinoBite`
- Default: `Shop All Products | PinoBite`

---

### 1.2 Meta Description
| Status | Details |
|--------|---------|
| ❌ **MISSING** | No meta description tag |

**Recommendation:** Dynamic description:
- Category: `Shop {category} by PinoBite. 100% natural, no preservatives. Buy healthy {category} online at best prices.`
- Search: `Search results for {query} — find your favorite healthy snacks at PinoBite`

---

### 1.3 Heading Structure
| Status | Details |
|--------|---------|
| ⚠️ **Partial** | `<h1>` contains category/search title. Product names use `<h3>`. |

**Observations:**
- `<h1>`: Shows "ALL PRODUCTS", category name, or "Results for 'query'" — good
- `<h3>`: Product names in grid — good hierarchy
- No `<h2>` used

**Recommendation:** Add `<h2>` for section headers (e.g., "Browse Categories", "Featured Products").

---

### 1.4 Product Images Alt Text
| Status | Details |
|--------|---------|
| ✅ **Good** | `alt={product.name}` on all product images |

---

### 1.5 Content
| Status | Details |
|--------|---------|
| ❌ **Thin Content** | Only product cards with name + price. No category descriptions. |

**Recommendation:** Add 50-100 word category description above/below product grid for SEO content.

---

### 1.6 Pagination
| Status | Details |
|--------|---------|
| ⚠️ **Not Implemented** | No pagination or load-more. All products loaded at once. |

**Recommendation:** Implement pagination with `rel="next"` / `rel="prev"`.

---

### 1.7 OG Tags
| Status | Details |
|--------|---------|
| ❌ **MISSING** | No category-specific OG tags |

---

## 2. Technical SEO

| Issue | Status | Recommendation |
|-------|--------|---------------|
| Canonical URL | ❌ Missing | `<link rel="canonical" href="https://pinobite.com/shop/{category}">` |
| Product Schema | ❌ Missing | Add ItemList schema for product listings |
| SSR / Prerendering | 🔴 Critical | Same CSR issue as homepage — no content for crawlers |
| Breadcrumb Schema | ❌ Missing | `Home > Shop > {Category}` |

---

## 3. Score Summary

| Category | Score |
|----------|-------|
| On-Page SEO | 4/10 |
| Technical SEO | 3/10 |
| **Overall** | **3.5/10** |
