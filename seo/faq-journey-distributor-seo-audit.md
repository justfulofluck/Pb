# FAQ, Journey & Distributor Pages SEO Audit — PinoBite

**Components:** `FAQPage.tsx`, `JourneyPage.tsx`, `DistributorPage.tsx`  
**Routes:** `/faq`, `/journey`, `/distributor`  
**Audit Date:** 2026-05-22

---

## FAQ PAGE (`/faq`)

### On-Page SEO

| Element | Status | Details |
|---------|--------|---------|
| Title | ⚠️ Generic | `FAQ | PinoBite` |
| Meta Description | ❌ Missing | — |
| H1 | ✅ Good | `Nuts & bolts: Your questions` |
| H2-H6 | ⚠️ Minimal | Only decorative; FAQ items not marked as headings |
| Content | ⚠️ Limited | Only 5 hardcoded FAQs; thin textual content |
| Internal Links | ⚠️ Minimal | Only mailto link |
| OG Tags | ❌ Missing | — |
| Canonical | ❌ Missing | — |
| Search | ✅ Present | Client-side FAQ search |

**Issues:**
- Only 5 FAQs — low value for "People Also Ask" rich results
- FAQ items use `<button>` + `<p>`, not proper heading structure per item
- No FAQPage structured data

**Recommendations:**
- Add FAQPage JSON-LD schema (critical for rich results):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What makes Pinobite nuts different?",
    "acceptedAnswer": { "@type": "Answer", "text": "We source only premium..." }
  }]
}
```
- Expand to 15-20 FAQs covering all product categories, shipping, returns, nutrition
- Dynamic title: `Frequently Asked Questions | PinoBite — Health Foods FAQ`
- Meta description: `Find answers about PinoBite's natural peanut butter, muesli & oats. Shipping, ingredients, nutrition, and more.`

---

## JOURNEY PAGE (`/journey`)

### On-Page SEO

| Element | Status | Details |
|---------|--------|---------|
| Title | ⚠️ Generic | `Our Journey | PinoBite` |
| Meta Description | ❌ Missing | — |
| H1 | ✅ Good | `The Pinobite story` |
| H2 | ✅ Good | `It started with a label reading obsession.` |
| Content | ✅ Good | Brand story, timeline, values section |
| Images | ⚠️ External | Images from Unsplash CDN (external), no WebP |
| Image Alt | ⚠️ Basic | `alt="Kitchen background"`, `alt="Founders"` — could be more descriptive |
| OG Tags | ❌ Missing | — |
| Canonical | ❌ Missing | — |

**Recommendations:**
- Title: `Our Story | PinoBite — From Kitchen to Health Food Brand`
- Meta description: `Discover the PinoBite story — how two health enthusiasts started making honest, natural snacks in a Mumbai kitchen. Read our journey.`
- Add Organization + WebSite JSON-LD here (about page is ideal)
- Improve image alt text: `alt="PinoBite founders Riya and Arjun in their Mumbai kitchen 2021"`
- Use local images instead of Unsplash CDN

---

## DISTRIBUTOR PAGE (`/distributor`)

### On-Page SEO

| Element | Status | Details |
|---------|--------|---------|
| Title | ⚠️ Generic | `Become a Distributor | PinoBite` |
| Meta Description | ❌ Missing | — |
| H1 | ✅ Good | `Join the [Logo] Family` |
| H2-H6 | ⚠️ None | No H2 used |
| Content | ⚠️ Thin | Mostly form; minimal explanatory content |
| Form | ✅ Present | Business name, name, phone, city, email |
| OG Tags | ❌ Missing | — |
| Canonical | ❌ Missing | — |

**Recommendations:**
- Add 200+ words of content above the form: benefits of distributing PinoBite, why partner, market opportunity
- Title: `Become a Distributor | PinoBite — Partner with India's Premium Health Food Brand`
- Meta description: `Join PinoBite's distribution network. Partner with a growing health food brand. Apply to become a distributor today.`
- Add H2 sections: "Why Partner with PinoBite?", "Distribution Areas", "Benefits"

---

## Common Issues (All 3 Pages)

| Issue | Status |
|-------|--------|
| No meta description | ❌ All missing |
| No OG / Twitter tags | ❌ All missing |
| No canonical URL | ❌ All missing |
| No JSON-LD structured data | ❌ All missing |
| CSR — no SSR/prerendering | 🔴 Critical for all |
| No breadcrumb schema | ❌ All missing |

---

## Score Summary

| Page | On-Page | Technical | Overall |
|------|---------|-----------|---------|
| FAQ Page | 4/10 | 3/10 | 3.5/10 |
| Journey Page | 5/10 | 3/10 | 4/10 |
| Distributor Page | 4/10 | 3/10 | 3.5/10 |
