# SEO Implementation Quick Reference Guide

## Overview
This guide walks through the SEO utilities and how to use them in your React pages.

---

## 1. Basic SEO Usage - `useSEO`

### Simple Meta Tags Only

```typescript
import { useSEO } from '../utils/useSEO';

const MyPage = () => {
  useSEO({
    title: 'My Page Title',
    description: 'My page description',
    keywords: 'keyword1, keyword2, keyword3',
    url: 'https://moraajewles.com/my-page',
    type: 'website'
  });

  return <div>Page content</div>;
};
```

---

## 2. Advanced SEO with Structured Data

### Using Schema Generators

```typescript
import { useSEO } from '../utils/useSEO';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';

const ProductPage = ({ product }) => {
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    priceCurrency: 'INR',
    availability: 'InStock',
    category: product.category,
    url: `https://moraajewles.com/product/${product.id}`,
    brand: 'MORAA REFLECTION'
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://moraajewles.com' },
    { name: 'Products', url: 'https://moraajewles.com/products' },
    { name: product.name, url: `https://moraajewles.com/product/${product.id}` }
  ]);

  useSEO({
    title: `${product.name} | MORAA REFLECTION`,
    description: product.description,
    keywords: `${product.name}, ${product.category}`,
    url: `https://moraajewles.com/product/${product.id}`,
    type: 'product',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [productSchema, breadcrumbSchema]
    }
  });

  return <div>{/* Product content */}</div>;
};
```

---

## 3. Using SEO Configuration

### Import and Use Config

```typescript
import { SEO_CONFIG, getPageSEO, getPageUrl } from '../utils/seoConfig';
import { useSEO } from '../utils/useSEO';

const HomePage = () => {
  const pageSEO = getPageSEO('home');
  
  useSEO({
    title: pageSEO.title,
    description: pageSEO.description,
    keywords: pageSEO.keywords,
    url: getPageUrl('/'),
    type: 'website'
  });

  return <div>{/* Home content */}</div>;
};
```

---

## 4. Available Schema Generators

### Product Schema
```typescript
import { generateProductSchema } from '../utils/schemaGenerator';

const schema = generateProductSchema({
  name: 'Diamond Earrings',
  description: 'Beautiful diamond earrings',
  image: 'https://...',
  price: 5000,
  priceCurrency: 'INR',
  availability: 'InStock',
  category: 'Earrings',
  url: 'https://moraajewles.com/product/123',
  rating: 4.5,
  reviewCount: 10,
  brand: 'MORAA REFLECTION',
  sku: 'DE-001'
});
```

### Breadcrumb Schema
```typescript
import { generateBreadcrumbSchema } from '../utils/schemaGenerator';

const schema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://moraajewles.com' },
  { name: 'Products', url: 'https://moraajewles.com/products' },
  { name: 'Earrings', url: 'https://moraajewles.com/earrings' }
]);
```

### Aggregate Offer Schema (for collections)
```typescript
import { generateAggregateOfferSchema } from '../utils/schemaGenerator';

const schema = generateAggregateOfferSchema(
  'Earrings Collection',
  'Premium earrings collection',
  'https://moraajewles.com/logo.png',
  1000, // minPrice
  50000, // maxPrice
  25, // offerCount
  'INR',
  'https://moraajewles.com/earrings'
);
```

### FAQ Schema
```typescript
import { generateFAQSchema } from '../utils/schemaGenerator';

const schema = generateFAQSchema([
  {
    question: 'Are your earrings authentic?',
    answer: 'Yes, all our earrings are 100% authentic.'
  },
  {
    question: 'What is the warranty?',
    answer: 'We offer a 2-year warranty on all products.'
  }
]);
```

### Article/Blog Post Schema
```typescript
import { generateArticleSchema } from '../utils/schemaGenerator';

const schema = generateArticleSchema({
  title: 'Guide to Choosing Diamond Earrings',
  image: 'https://...',
  datePublished: '2026-03-12',
  dateModified: '2026-03-12',
  author: 'MORAA REFLECTION',
  description: 'A complete guide to choosing the perfect diamond earrings',
  url: 'https://moraajewles.com/blog/guide-diamond-earrings'
});
```

### Local Business Schema
```typescript
import { generateLocalBusinessSchema } from '../utils/schemaGenerator';

const schema = generateLocalBusinessSchema(
  'MORAA REFLECTION',
  'Premium luxury jewelry retailer',
  'https://moraajewles.com',
  {
    streetAddress: '123 Main Street',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400001',
    addressCountry: 'IN'
  },
  '+91-9999999999',
  'support@moraaluxury.com'
);
```

### Event Schema
```typescript
import { generateEventSchema } from '../utils/schemaGenerator';

const schema = generateEventSchema(
  'Summer Jewelry Sale',
  'Shop our exclusive summer collection with up to 50% off',
  '2026-06-01',
  '2026-06-30',
  'https://moraajewles.com/sale.jpg',
  'https://moraajewles.com/summer-sale',
  'MORAA REFLECTION Store'
);
```

---

## 5. SEO Meta Tags - What They Do

### Required Tags
| Tag | Purpose | Example |
|-----|---------|---------|
| `<title>` | Page title for SERP | "Premium Earrings - MORAA" |
| `<meta name="description">` | Page summary for SERP | "Shop beautiful earrings..." |

### Important Tags
| Tag | Purpose | Example |
|-----|---------|---------|
| `<meta name="keywords">` | Target keywords | "earrings, luxury, jewelry" |
| `<link rel="canonical">` | Prevent duplicate content | Same as og:url |
| `<meta name="robots">` | Crawling instructions | "index, follow" |

### Social Sharing
| Tag | Platform | Example |
|-----|----------|---------|
| `og:title` | Facebook/LinkedIn | Product name |
| `og:description` | Facebook/LinkedIn | Product description |
| `og:image` | Facebook/LinkedIn | Product image URL |
| `twitter:title` | Twitter | Product name |
| `twitter:image` | Twitter | Product image URL |

---

## 6. Complete Page Example

```typescript
import React from 'react';
import { useSEO } from '../utils/useSEO';
import { generateProductSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { SEO_CONFIG } from '../utils/seoConfig';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const ProductDetailPage = ({ product }: { product: Product }) => {
  // Generate schemas
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    priceCurrency: 'INR',
    availability: 'InStock',
    category: product.category,
    url: `${SEO_CONFIG.canonicalBase}/product/${product.id}`,
    brand: 'MORAA REFLECTION'
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: SEO_CONFIG.canonicalBase },
    { name: 'Products', url: `${SEO_CONFIG.canonicalBase}/products` },
    { name: product.category, url: `${SEO_CONFIG.canonicalBase}/${product.category.toLowerCase()}` },
    { name: product.name, url: `${SEO_CONFIG.canonicalBase}/product/${product.id}` }
  ]);

  // Set SEO
  useSEO({
    title: `${product.name} - Premium ${product.category} | ${SEO_CONFIG.siteName}`,
    description: product.description,
    keywords: `${product.name}, ${product.category}, luxury jewelry, premium jewelry`,
    image: product.image,
    url: `${SEO_CONFIG.canonicalBase}/product/${product.id}`,
    type: 'product',
    author: SEO_CONFIG.siteName,
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [productSchema, breadcrumbSchema]
    }
  });

  return (
    <div>
      {/* Product content here */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.image} alt={product.name} />
      <span>₹{product.price}</span>
    </div>
  );
};

export default ProductDetailPage;
```

---

## 7. Testing Your SEO

### Testing Tools
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Paste your page URL
   - Verify structured data is recognized

2. **Schema.org Validator**: https://validator.schema.org/
   - Copy JSON-LD code
   - Validate for correctness

3. **Google PageSpeed Insights**: https://pagespeed.web.dev/
   - Check Core Web Vitals
   - Mobile/Desktop performance

4. **Open Graph Debugger**: https://developers.facebook.com/tools/debug/
   - Test social media sharing preview

---

## 8. Common SEO Optimization Tips

### ✅ Do's
- ✅ Use unique, descriptive titles and descriptions
- ✅ Include target keywords naturally
- ✅ Use proper heading hierarchy (H1 → H2 → H3)
- ✅ Optimize images with alt text
- ✅ Create internal links between related pages
- ✅ Ensure mobile responsiveness
- ✅ Use structured data for rich snippets
- ✅ Keep descriptions between 150-160 characters

### ❌ Don'ts
- ❌ Stuff keywords unnaturally
- ❌ Use duplicate titles/descriptions
- ❌ Create doorway pages
- ❌ Use cloaking techniques
- ❌ Generate automatic or duplicate content
- ❌ Use hidden text or links
- ❌ Ignore mobile optimization

---

## 9. File References

| File | Purpose |
|------|---------|
| `src/utils/useSEO.ts` | Main SEO hook - use in all pages |
| `src/utils/schemaGenerator.ts` | Schema generators for structured data |
| `src/utils/seoConfig.ts` | Global SEO configuration and helpers |
| `index.html` | Base HTML with default SEO tags |
| `public/robots.txt` | Crawling rules |
| `public/sitemap.xml` | URL list for search engines |

---

## 10. Next Steps

1. **Verify Domain Ownership**
   - Add verification codes to `index.html`
   - Submit to Google Search Console
   - Submit to Bing Webmaster Tools

2. **Monitor Performance**
   - Check Search Console for errors
   - Monitor keyword rankings
   - Track organic traffic

3. **Continuous Optimization**
   - Add FAQ schema for support pages
   - Implement review/rating schemas
   - Create category landing pages
   - Build internal linking strategy

---

**Last Updated**: March 12, 2026
**Version**: 1.0
