import type { RequestHandler } from './$types';

const categories = [
  'education-consultancies',
  'ecommerce',
  'trekking-tourism',
  'isp-telecom',
  'hospitals-healthcare',
];

export const GET: RequestHandler = async () => {
  const base = 'https://biswaas.pages.dev';

  const urls = [
    { loc: base, priority: '1.0', changefreq: 'daily' },
    { loc: `${base}/categories`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${base}/search`, priority: '0.7', changefreq: 'daily' },
    ...categories.map((slug) => ({
      loc: `${base}/categories/${slug}`,
      priority: '0.8',
      changefreq: 'weekly' as const,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
