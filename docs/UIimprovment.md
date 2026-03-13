# UI/UX Improvements Based on Web Interface Guidelines

## Accessibility Issues

### Navbar.tsx
- **Line 318**: `<div onClick>` for search results - needs keyboard handler (`onKeyDown`/`onKeyUp`) or use `<button>`
- **Line 347**: `<div onClick>` for blog items - needs keyboard handler or use `<button>`
- **Line 374**: `<div onClick>` for event items - needs keyboard handler or use `<button>`

### ProductPage.tsx
- **Line 208**: `<a onClick>` used for action - should be `<button>`

---

## Form Issues

### AuthModal.tsx
- **Lines 136-155**: Form inputs lack `autocomplete` and `name` attributes
- **Lines 202-222, 225-245**: Signup form inputs missing `autocomplete` and `name`
- **Line 169**: "LOGGING IN..." - use "…" instead of "..."
- **Line 250**: "CREATING ACCOUNT..." - use "…" instead of "..."
- **Lines 80, 94**: Using `alert()` - use inline error/toast instead
- **Line 287**: Submit button lacks `disabled` state during loading

### CheckoutPage.tsx
- **Lines 25-34**: Form state lacks `name` attributes on all inputs
- Form inputs missing `autocomplete` attributes (email, tel, etc.)

---

## Animation Issues

### ProductPage.tsx
- **Lines 46-55**: Inline animations without `prefers-reduced-motion` support
- Animation continues on devices where user prefers reduced motion

---

## Image/CLS Issues

### ProductPage.tsx
- **Line 40**: `<img>` lacks explicit `width` and `height` (causes Cumulative Layout Shift)

---

## HTML/Meta Issues

### index.html
- **Missing**: `<meta name="theme-color">` for proper browser UI theming
- **Missing**: `color-scheme` CSS property for proper dark mode scrollbars

---

## Recommended Fixes

### Fix 1: Convert div onClick to buttons (Navbar.tsx)
```tsx
// Current (broken):
<div onClick={() => { onProductClick(product); ... }}>

// Should be:
<button onClick={() => { onProductClick(product); ... }}>
  // content
</button>
```
or add `onKeyDown`, `onKeyUp` handlers for Enter/Space keys

### Fix 2: Add form attributes (AuthModal.tsx)
```tsx
<input
  required
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="..."
  placeholder="Enter your email"
  // Add:
  name="email"
  autoComplete="email"
  id="email"
/>
```

### Fix 3: Typography ellipsis
```tsx
// Current:
{isLoading ? 'LOGGING IN...' : "LET'S GO!"}

// Should be:
{isLoading ? 'Logging in…' : "Let's Go!"}
```

### Fix 4: Add reduced motion support (ProductPage.tsx)
```tsx
<style>{`
  @keyframes floatJar { ... }
  @media (prefers-reduced-motion: reduce) {
    @keyframes floatJar { 
      0% { transform: none; }
      100% { transform: none; }
    }
  }
`}</style>
```

### Fix 5: Add image dimensions (ProductPage.tsx)
```tsx
// Current:
<img src={product.image} alt={product.name} className="..." />

// Should be:
<img src={product.image} alt={product.name} width={750} height={750} className="..." />
```

### Fix 6: Add theme-color meta tag (index.html)
```html
<meta name="theme-color" content="#f2f2ec">
```
