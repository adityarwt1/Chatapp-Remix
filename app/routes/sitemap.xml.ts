import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://chatapp-remix.vercel.app/</loc>
      <lastmod>2025-02-08</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <!-- Add other URLs here -->
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400", // 24 hours cache
    },
  });
};
