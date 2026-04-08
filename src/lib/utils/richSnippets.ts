/**
 * Google Seller Ratings JSON-LD generator
 * Produces schema.org compliant structured data for rich snippets in Google Search.
 */

export interface SellerRatingBusiness {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  address?: string;
  telephone?: string;
  ratingValue: number;
  ratingCount: number;
  bestRating?: number;
  worstRating?: number;
}

/**
 * Generates a schema.org JSON-LD string for Google Seller Ratings.
 *
 * @see https://schema.org/AggregateRating
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */
export function generateSellerRating(business: SellerRatingBusiness): string {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": business.name,
    ...(business.url && { "url": business.url }),
    ...(business.logo && { "logo": business.logo }),
    ...(business.description && { "description": business.description }),
    ...(business.address && {
      "address": {
        "@type": "PostalAddress",
        "addressLocality": business.address,
        "addressCountry": "NP",
      },
    }),
    ...(business.telephone && { "telephone": business.telephone }),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": business.ratingValue,
      "bestRating": business.bestRating ?? 5,
      "worstRating": business.worstRating ?? 1,
      "ratingCount": business.ratingCount,
    },
  };

  return JSON.stringify(jsonLd);
}

/**
 * Returns a full `<script type="application/ld+json">` tag ready to embed in `<head>`.
 */
export function sellerRatingScript(business: SellerRatingBusiness): string {
  return `<script type="application/ld+json">${generateSellerRating(business)}</script>`;
}
