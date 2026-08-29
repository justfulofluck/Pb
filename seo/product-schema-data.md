# Product Schema & Google Merchant Center Data

## Product JSON-LD Schema

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "{product.name}",
  "image": [
    "{product.image_url}",
    "{gallery_image_1}",
    "{gallery_image_2}"
  ],
  "description": "{product.description}",
  "sku": "{product.slug}",
  "mpn": "PINOBITE-{product.id}",
  "brand": {
    "@type": "Brand",
    "name": "PinoBite"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Tri-Origin Ayurveda"
  },
  "category": "{product.category}",
  "offers": {
    "@type": "Offer",
    "url": "https://pinobite.com/product/{product.slug}",
    "priceCurrency": "INR",
    "price": "{product.price}",
    "priceValidUntil": "{date + 1 year}",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "PinoBite"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{product.rating}",
    "reviewCount": "{product.review_count}",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

## Merchant Center XML Product Feed Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>PinoBite Products</title>
    <link>https://pinobite.com</link>
    <description>PinoBite Product Feed for Google Merchant Center</description>
    <item>
      <g:id>PINOBITE-{product.id}</g:id>
      <g:title>{product.name}</g:title>
      <g:description>{product.description}</g:description>
      <g:link>https://pinobite.com/product/{product.slug}</g:link>
      <g:image_link>{product.image_url}</g:image_link>
      <g:additional_image_link>{gallery_image_urls}</g:additional_image_link>
      <g:availability>in_stock</g:availability>
      <g:price>{product.price} INR</g:price>
      <g:sale_price>{product.original_price} INR</g:sale_price>
      <g:brand>PinoBite</g:brand>
      <g:mpn>PINOBITE-{product.id}</g:mpn>
      <g:google_product_category>Health &amp; Beauty &gt; Health Foods</g:google_product_category>
      <g:product_type>{product.category}</g:product_type>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:multipack>1</g:multipack>
    </item>
  </channel>
</rss>
```

## Organization Schema (Global — Site-wide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PinoBite",
  "url": "https://pinobite.com",
  "logo": "https://pinobite.com/logos/Pinobite-logo.png",
  "description": "PinoBite makes 100% natural peanut butter, healthy muesli, and premium oats. No preservatives, no additives.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9328173747",
    "contactType": "customer service",
    "availableLanguage": ["English", "Hindi"]
  },
  "sameAs": [
    "https://facebook.com/pinobitehealth",
    "https://instagram.com/pinobitehealth"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tri-Origin Ayurveda",
    "addressLocality": "Gujarat",
    "addressCountry": "IN"
  }
}
```

## WebSite Schema (Global — for Sitelinks Search Box)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PinoBite",
  "url": "https://pinobite.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://pinobite.com/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

## BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://pinobite.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{product.category}",
      "item": "https://pinobite.com/shop/{category_slug}"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{product.name}",
      "item": "https://pinobite.com/product/{product.slug}"
    }
  ]
}
```

## How They Connect

| Schema | Where it goes | Purpose |
|--------|--------------|---------|
| **Organization** | `index.html` `<head>` (global) | Brand knowledge panel in Google |
| **WebSite** | `index.html` `<head>` (global) | Sitelinks search box in SERP |
| **Product** | ProductPage `<head>` (per product) | Rich results: price, stars, availability |
| **BreadcrumbList** | ProductPage `<head>` (per page) | Breadcrumb trail in SERP |
| **XML Feed** | Django endpoint `/api/merchant/feed.xml` | Google Merchant Center / Shopping ads |
