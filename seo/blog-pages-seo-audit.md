# Blog Pages SEO Audit Report — PinoBite

**Components:** `BlogsPage.tsx` (listing), `BlogDetailPage.tsx` (detail)  
**Routes:** `/blogs`, `/blog/{slug}`  
**Audit Date:** 2026-05-22

---

## BLOG LISTING PAGE (`/blogs`)

### 1. On-Page SEO

| Element | Status | Details |
|---------|--------|---------|
| Title | ⚠️ Generic | `Blogs | PinoBite` — same for all filters/searches |
| Meta Description | ❌ Missing | — |
| H1 | ✅ Good | `The Wellness Journal` |
| H2-H6 | ✅ Good | Sections use heading hierarchy |
| Image Alt | ✅ Good | `alt={post.title}` on blog thumbnails |
| Content | ⚠️ Thin | Only titles + excerpts in cards, no category text |
| OG Tags | ❌ Missing | — |
| Canonical | ❌ Missing | — |

**Issues:**
- No blog category/tag archive differentiation in SEO meta
- Search/filter results not reflected in page meta

**Recommendations:**
- Dynamic title: `Health & Nutrition Blog | PinoBite — The Wellness Journal`
- Meta description: `Explore healthy recipes, nutrition tips, and wellness stories from PinoBite. Your guide to natural living.`
- Add BlogPosting schema markup for each card on listing page

---

## BLOG DETAIL PAGE (`/blog/{slug}`)

### 1. On-Page SEO

| Element | Status | Details |
|---------|--------|---------|
| Title | ⚠️ Dynamic | `{post.title} | PinoBite` — good, but could include keywords |
| Meta Description | ❌ Missing | Uses `post.excerpt` but not in meta tag |
| H1 | ✅ Good | `{post.title}` — dynamic, unique per post |
| H2 | ✅ Good | Used for sections like "Nutrition & Benefits", "Rooted in Tradition" |
| H3 | ✅ Good | Used for sub-sections, key point titles |
| Image Alt | ✅ Good | `alt={post.title}` on featured image |
| Content | ✅ Excellent | Rich content via Tiptap editor, structured sections |
| Author Bio | ✅ Present | Author name, image, role, date |
| Social Share | ✅ Present | Native share + copy link button |
| OG Tags | ❌ Missing | No blog-specific OG tags for social sharing |
| Canonical | ❌ Missing | — |

**Recommendations:**
- Add `<meta name="description" content="{post.excerpt}">` dynamically
- Add OG tags per post: `og:title`, `og:description`, `og:image`, `og:type: article`
- Add Article/BlogPosting JSON-LD schema
- Add canonical URL per post

### 2. Structured Data — BlogPosting Schema

**Critical Missing**: Without Article schema, blog posts miss out on rich results in Google Discover and Search.

**Recommended Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{post.title}",
  "description": "{post.excerpt}",
  "image": "{post.image}",
  "author": {
    "@type": "Person",
    "name": "{post.author}"
  },
  "datePublished": "{post.date}",
  "publisher": {
    "@type": "Organization",
    "name": "PinoBite",
    "logo": { "@type": "ImageObject", "url": "https://pinobite.com/logos/Pinobite-logo.png" }
  }
}
```

### 3. Technical SEO

| Issue | Status | Recommendation |
|-------|--------|---------------|
| SSR / Prerendering | 🔴 Critical | Blog content rendered client-side; crawlers may not see it |
| Canonical URL | ❌ Missing | Add per post |
| Breadcrumb Schema | ❌ Missing | `Home > Blog > {title}` |
| Reading Progress | ✅ Present | Visual progress bar — UX good |
| Sitemap inclusion | ❌ Missing | Blog posts must be in sitemap.xml |

### 4. Content & Internal Linking

| Aspect | Status | Notes |
|--------|--------|-------|
| Read time | ✅ Present | Shown in listing cards |
| Categories/Tags | ✅ Present | Recipe, Lifestyle, News — filterable |
| Related content | ⚠️ Missing | No related posts at bottom of article |
| Internal links in content | ⚠️ Not Verified | Content may contain links, but no product links visible |

**Recommendation:** Add related posts section + contextual product links within blog content.

---

## Score Summary

| Page Type | On-Page | Technical | Overall |
|-----------|---------|-----------|---------|
| Blog Listing | 5/10 | 3/10 | 4/10 |
| Blog Detail | 6/10 | 3/10 | 4.5/10 |
