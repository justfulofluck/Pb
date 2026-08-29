# Product Page SEO — Issues & Action Plan

## Current SEO Issues

### Critical (blocking search visibility)

| Issue | Details |
|-------|---------|
| **No meta description** | Only `document.title` is set (`{name} | PinoBite`). No `<meta name="description">` tag at all |
| **No Open Graph / Twitter tags** | Product shared on social media shows no image, price, or description |
| **No canonical URL** | Possible duplicate content if product is accessible via multiple routes |
| **No Product JSON-LD schema** | No rich results in SERP (no star ratings, price, availability) |
| **No SSR / prerendering** | React SPA — crawlers that don't execute JS see a blank page |
| **No BreadcrumbList schema** | Breadcrumbs component exists (`Breadcrumbs.tsx`) but isn't used on the product page |

### High Priority

| Issue | Details |
|-------|---------|
| **Title tag too basic** | Format is just `{name} | PinoBite`. Should include category + keywords like "Buy 100% Natural {Category} Online" |
| **Product description hidden** | Description text is buried in a popup drawer. No visible body text for search crawlers |
| **No image alt text optimization** | Uses `alt={product.name}` but should include brand keywords |
| **No WebP / lazy loading / srcset** | Images served as PNG, no lazy loading below the fold |
| **3D model viewer not lazy loaded** | Heavy JS/CSS loads immediately, impacting Core Web Vitals |

### Medium Priority

| Issue | Details |
|-------|---------|
| **No H2 subtitle** | Only an H1 with product name. Missing a descriptive H2 with category/type |
| **No breadcrumb navigation** | Users can't see "Home > Peanut Butter > Product Name" |
| **Product descriptions may be duplicated** | No unique 50-100 word description per product visible on page |

---

## New Sections to Add (Competitor Reference)

Based on competitors: The Whole Truth, Yoga Bar, Slurrp Farm, MuscleBlaze, Disano.

| Section | Competitors Using It | Why |
|---------|---------------------|-----|
| **Breadcrumbs** | All D2C food brands | Navigation trail for UX + `BreadcrumbList` schema for SERP |
| **Product-specific FAQ** | The Whole Truth, Yoga Bar | Answers purchase barriers (shelf life, storage, usage) + FAQ schema for rich results |
| **Shipping / Delivery Info** | All competitors | "Free shipping over ₹499", "2-5 day delivery" — reduces drop-off |
| **Trust Badges** | Slurrp Farm, MuscleBlaze | FSSAI, Non-GMO, Gluten-Free, No Preservatives badges build trust |
| **Bundle / Volume Deals** | MuscleBlaze, Disano | "Buy 2 Save 10%", combo offers increase AOV |
| **UGC / Customer Photos** | The Whole Truth | Customer photo gallery with social proof |
| **Unique Product Description** | All brands | SEO body text (50-100 words) with keywords, not hidden in a popup |
| **Product Specs Table** | All brands | Net weight, shelf life, storage, country of origin, allergen info — all visible on page, not in popup |

---

## Implementation Plan

### Phase 1 — Quick Wins (1-2 days)

1. Add `react-helmet-async` and create a `ProductPageSEO` component that injects:
   - Dynamic meta description (using product data)
   - OG tags (title, description, image, url, price)
   - Twitter card tags
   - Canonical URL
   - Product JSON-LD schema (`Product` + `Offer` + `AggregateRating`)
   - BreadcrumbList JSON-LD schema
2. Improve the `document.title` format to include category and keywords
3. Add breadcrumb navigation UI to the top of ProductPage

### Phase 2 — Content & Layout (2-3 days)

4. Move product description from popup to visible body text between hero and "Small Size Huge Flavor" section
5. Add "Product Specifications" section (weight, shelf life, storage, allergens, country of origin) visible on page
6. Add trust badges row (FSSAI, Non-GMO, Gluten-Free, No Preservatives)
7. Add shipping/delivery info bar

### Phase 3 — Performance (2-3 days)

8. Lazy load 3D model viewer (only load on scroll or intersection)
9. Convert images to WebP + add `loading="lazy"` + `srcset`
10. Add `fetchpriority="high"` to hero image
11. Preload critical fonts/assets

### Phase 4 — Advanced (3-5 days)

12. Add product FAQ section with FAQ schema
13. Add bundle / volume discount section
14. Add customer photo UGC gallery
15. Implement SSR or prerendering (prerender.io)
16. Add `srcset` / responsive images
