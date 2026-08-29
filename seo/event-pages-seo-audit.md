# Event Pages SEO Audit Report — PinoBite

**Components:** `EventBlogsPage.tsx` (listing), `EventDetailsPage.tsx` (detail)  
**Routes:** `/events`, `/event/{id}`  
**Audit Date:** 2026-05-22

---

## EVENT LISTING PAGE (`/events`)

| Element | Status | Details |
|---------|--------|---------|
| Title | ⚠️ Generic | `Events | PinoBite` |
| Meta Description | ❌ Missing | — |
| H1 | ✅ Good | `Event Stories` |
| H2-H6 | ⚠️ None | No H2 used; only H1 and H3 for event cards |
| Image Alt | ✅ Good | `alt={event.title}` on thumbnails |
| Content | ⚠️ Thin | Only event cards with title + summary; no introductory content |
| OG Tags | ❌ Missing | — |
| Canonical | ❌ Missing | — |
| Search | ✅ Present | Search by title/location |

**Recommendations:**
- Title: `Community Events & Workshops | PinoBite`
- Meta description: `Explore PinoBite's community events, health workshops, and gatherings. Join us in spreading wellness across India.`
- Add structured data with Event schema for each event card
- Add introductory paragraph about the event series

---

## EVENT DETAIL PAGE (`/event/{id}`)

| Element | Status | Details |
|---------|--------|---------|
| Title | ⚠️ Dynamic | `{event.title} | PinoBite` — acceptable |
| Meta Description | ❌ Missing | Should use event summary |
| H1 | ✅ Good | `{event.title}` in hero overlay |
| H2 | ✅ Good | Used for story sections (e.g., "The Highlights") |
| H3-H4 | ✅ Good | Used for stats, featured products |
| Image Alt | ✅ Good | `alt={event.title}` on hero image, `alt={product.name}` on product images |
| Content | ✅ Good | Full story sections with rich text |
| Event Stats | ✅ Present | Impact participants, bars shared, vibe energy |
| OG Tags | ❌ Missing | — |
| Canonical | ❌ Missing | — |

**Recommendations:**
- Add `<meta name="description" content="{event.summary}">`
- Add OG tags: `og:title`, `og:description`, `og:image` (event hero image), `og:url`
- Add Event JSON-LD structured data

### Structured Data — Event Schema (Critical Missing)

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "{event.title}",
  "description": "{event.summary}",
  "image": "{event.image}",
  "startDate": "{event.date}",
  "location": {
    "@type": "Place",
    "name": "{event.location}"
  },
  "organizer": {
    "@type": "Organization",
    "name": "PinoBite"
  }
}
```

### Technical SEO

| Issue | Status | Recommendation |
|-------|--------|---------------|
| SSR / Prerendering | 🔴 Critical | Same CSR issue |
| Canonical URL | ❌ Missing | `<link rel="canonical" href="https://pinobite.com/event/{id}">` |
| Breadcrumb Schema | ❌ Missing | `Home > Events > {title}` |
| Sitemap | ❌ Missing | Events must be in sitemap |

---

## Score Summary

| Page Type | On-Page | Technical | Overall |
|-----------|---------|-----------|---------|
| Event Listing | 4/10 | 3/10 | 3.5/10 |
| Event Detail | 5/10 | 3/10 | 4/10 |
