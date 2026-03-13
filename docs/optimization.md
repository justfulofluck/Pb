# Performance Optimization Guide

Based on Vercel React Best Practices - Prioritized by Impact

---

## Executive Summary

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Bundle Size Optimization | CRITICAL |
| 2 | Eliminating Waterfalls | CRITICAL |
| 3 | Re-render Optimization | MEDIUM |
| 4 | Rendering Performance | MEDIUM |
| 5 | Client-Side Data Fetching | MEDIUM-HIGH |

---

## Current Issues Found

| Category | Issue | File:Line | Rule |
|----------|-------|-----------|------|
| **Bundle Size** | All components loaded eagerly | App.tsx:1-39 | `bundle-dynamic-imports` |
| **Bundle Size** | No code splitting | App.tsx | `bundle-dynamic-imports` |
| **Re-renders** | Large App.tsx with no memoization | App.tsx | `rerender-memo` |
| **Data Fetching** | No request deduplication | App.tsx:200-208 | `client-swr-dedup` |
| **Rendering** | No virtualization for product lists | ProductGrid.tsx | `rendering-content-visibility` |
| **Rendering** | Heavy 3D model-viewer loaded globally | ProductPage.tsx | `bundle-dynamic-imports` |

---

## Optimization Plan

### 1. Bundle Size Optimization (CRITICAL - Highest Impact)

**Issue**: All 40+ components are imported and loaded at initial bundle

**Fix**: Use dynamic imports for route-based code splitting

```tsx
// BEFORE (App.tsx)
import ShopPage from './components/ShopPage';
import CheckoutPage from './components/CheckoutPage';
import AdminDashboard from './components/AdminDashboard';

const AppContent: React.FC = () => {
  if (currentView === 'shop') return <ShopPage ... />;
  if (currentView === 'checkout') return <CheckoutPage ... />;
};

// AFTER - Use lazy loading
import { lazy, Suspense } from 'react';

const ShopPage = lazy(() => import('./components/ShopPage'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const FAQPage = lazy(() => import('./components/FAQPage'));
const BlogsPage = lazy(() => import('./components/BlogsPage'));
const DistributorPage = lazy(() => import('./components/DistributorPage'));
// ... add lazy loading for all route components

const AppContent: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {currentView === 'shop' && <ShopPage ... />}
      {currentView === 'checkout' && <CheckoutPage ... />}
    </Suspense>
  );
};
```

**Expected Impact**: ~40% reduction in initial bundle size

**Files to modify**: `App.tsx`

---

### 2. Eliminating Waterfalls (CRITICAL)

**Status**: ✅ Already using `Promise.all()` at line 200 - GOOD

The current implementation already parallelizes API calls:

```tsx
// App.tsx:200-208 - Already optimal
const [eventsRes, blogsRes, storiesRes, productsRes, vFormsRes, categoriesRes, annRes] = await Promise.all([
  fetch(`${API_BASE_URL}/api/events/`),
  fetch(`${API_BASE_URL}/api/blog-posts/`),
  fetch(`${API_BASE_URL}/api/stories/`),
  fetch(`${API_BASE_URL}/api/products/`),
  fetch(`${API_BASE_URL}/api/visitor-forms/`),
  fetch(`${API_BASE_URL}/api/categories/`),
  fetch(`${API_BASE_URL}/api/announcements/`)
]);
```

---

### 3. Client-Side Data Fetching (MEDIUM-HIGH)

**Issue**: No request deduplication - same API called multiple times on navigation

**Fix**: Implement SWR for caching/deduplication

```bash
# Install SWR
npm install swr
```

```tsx
// Create hooks/useSWRData.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useProducts() {
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/api/products/`,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 60000 // 1 minute
    }
  );
  return { products: data, isLoading, error };
}

export function useBlogs() {
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/api/blog-posts/`,
    fetcher,
    { revalidateOnFocus: false }
  );
  return { blogs: data, isLoading, error };
}

export function useEvents() {
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/api/events/`,
    fetcher,
    { revalidateOnFocus: false }
  );
  return { events: data, isLoading, error };
}
```

**Benefits**:
- Automatic request deduplication
- Cache management
- Background revalidation
- Handle errors gracefully

**Files to create**: `hooks/useSWRData.ts`
**Files to modify**: `App.tsx`

---

### 4. Re-render Optimization (MEDIUM)

**Issue**: Large component tree causes unnecessary re-renders

**Fix**: Add React.memo to frequently rendered components

```tsx
// ProductGrid.tsx
import { memo } from 'react';

interface ProductGridProps {
  products: Product[];
  onProductClick: (p: Product) => void;
}

const ProductGrid = memo(({ products, onProductClick }: ProductGridProps) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {products.map(product => (
      <ProductCard 
        key={product.id} 
        product={product} 
        onClick={() => onProductClick(product)} 
      />
    ))}
  </div>
));

ProductGrid.displayName = 'ProductGrid';
export default ProductGrid;
```

```tsx
// CategoryList.tsx
import { memo } from 'react';

const CategoryList = memo(({ categories, onCategoryClick }: CategoryListProps) => (
  <div className="flex gap-4 overflow-x-auto">
    {categories.map(cat => (
      <button key={cat.id} onClick={() => onCategoryClick(cat.name)}>
        {cat.name}
      </button>
    ))}
  </div>
));

CategoryList.displayName = 'CategoryList';
export default CategoryList;
```

**Files to modify**: `ProductGrid.tsx`, `CategoryList.tsx`, `ProductPage.tsx`

---

### 5. Rendering Performance (MEDIUM)

**Issue**: No virtualization for large lists (products, blogs)

**Fix 1**: Add CSS content-visibility for simple improvement

```css
/* styles/snaxxo.css */
.product-card {
  content-visibility: auto;
  contain-intrinsic-size: 350px;
}

.blog-card {
  content-visibility: auto;
  contain-intrinsic-size: 200px;
}
```

**Fix 2**: For very large lists (100+ items), consider virtualization

```bash
# Install virtua for virtualization
npm install virtua
```

```tsx
// For ProductGrid with 100+ items
import { Virtua } from 'virtua';

const ProductGrid = ({ products, onProductClick }) => (
  <Virtua>
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </Virtua>
);
```

**Files to modify**: `styles/snaxxo.css`, `ProductGrid.tsx`

---

### 6. Lazy Load Heavy Components (MEDIUM)

**Issue**: `model-viewer` (3D), GSAP animations loaded on all pages

**Fix**: Lazy load 3D viewer only on product detail page

```tsx
// ProductPage.tsx - lazy load model-viewer
import { lazy, Suspense } from 'react';

const ModelViewer = lazy(() => import('./components/ModelViewer'));

const ProductPage: React.FC<ProductPageProps> = ({ product, ... }) => {
  return (
    <div>
      <Suspense fallback={<img src={product.image} alt={product.name} />}>
        {product.model3d && <ModelViewer modelSrc={product.model3d} alt={product.name} />}
      </Suspense>
    </div>
  );
};
```

**Alternative**: Use dynamic import in the model-viewer component itself

```tsx
// StableModelViewer.tsx - Already using React.memo, good!
// Consider loading model-viewer script dynamically only when needed
```

---

## Implementation Priority

| Priority | Action | Expected Impact | Effort |
|----------|--------|-----------------|--------|
| 1 | Add dynamic imports for routes | ~40% bundle reduction | Medium |
| 2 | Add React.memo to list components | Faster re-renders | Low |
| 3 | Add content-visibility CSS | Faster initial paint | Low |
| 4 | Lazy load model-viewer | Faster product page | Medium |
| 5 | Add SWR for caching | Fewer network requests | Medium |

---

## Quick Wins (Low Effort)

1. **Add loading skeleton components** - Perceived performance improvement
2. **Add `will-change` CSS** - For animated elements
3. **Optimize images** - Use WebP, add lazy loading
4. **Add `rel="preload"`** - For critical fonts

```html
<!-- index.html -->
<link rel="preload" href="/fonts/critical-font.woff2" as="font" type="font/woff2" crossorigin>
```

---

## Monitoring

After implementing optimizations, monitor:
- Lighthouse Performance score
- Core Web Vitals (LCP, FID, CLS)
- Bundle size (run `npm run build` and check dist folder)
- Time to Interactive (TTI)
