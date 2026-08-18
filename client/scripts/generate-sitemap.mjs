import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { PUBLIC_SEO_ROUTES, SITE_URL } from "../src/seo/seoConfig.js";

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PUBLIC_SEO_ROUTES.map(
  (route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n  </url>`,
).join("\n")}\n</urlset>\n`;
const routeManifest = `${JSON.stringify({ routes: PUBLIC_SEO_ROUTES }, null, 2)}\n`;
const here = dirname(fileURLToPath(import.meta.url));
const publicDirectory = resolve(here, "../public");

await Promise.all([
  writeFile(resolve(publicDirectory, "sitemap.xml"), xml, "utf8"),
  writeFile(
    resolve(publicDirectory, "seo-routes.json"),
    routeManifest,
    "utf8",
  ),
]);

console.log(
  `Generated sitemap and route manifest with ${PUBLIC_SEO_ROUTES.length} canonical public routes.`,
);
