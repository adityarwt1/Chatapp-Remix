import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  const sitemap = `<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://chatapp-remix.vercel.app/</loc>
    <lastmod>2025-02-08</lastmod>
<changefreq>daily</changefreq>
<priority>1</priority>
</url>
<url>
    <loc>https://chatapp-remix.vercel.app/login</loc>
    <lastmod>2025-02-08</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>

<url>
    <loc>https://chatapp-remix.vercel.app/chat</loc>
    <lastmod>2025-02-08</lastmod>
<changefreq>monthly</changefreq>
<priority>0.7</priority>
</url>
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400", // 24 hours cache
    },
  });
};
