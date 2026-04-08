export function businessJsonLd(business: {
  name: string;
  description: string;
  trustScore: number;
  totalReviews: number;
  address?: string;
  phone?: string;
  websiteUrl?: string;
}) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": business.trustScore,
      "bestRating": 5,
      "worstRating": 1,
      "reviewCount": business.totalReviews,
    },
    ...(business.address && { "address": { "@type": "PostalAddress", "addressLocality": business.address, "addressCountry": "NP" } }),
    ...(business.phone && { "telephone": business.phone }),
    ...(business.websiteUrl && { "url": business.websiteUrl }),
  });
}

export function categoryJsonLd(category: { name: string; description: string; businessCount: number }) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.description,
    "numberOfItems": category.businessCount,
  });
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url,
    })),
  });
}
