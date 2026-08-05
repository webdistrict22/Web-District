import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { workProjects } from "../src/data/demoProjects.js";

const origin = "https://www.web-district.com";
const dynamicSlugs = [];
if (process.env.SITEMAP_PROJECTS_ENDPOINT) {
  try {
    const response = await fetch(process.env.SITEMAP_PROJECTS_ENDPOINT, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    for (const project of payload.projects || payload.data || []) {
      if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug || "")) dynamicSlugs.push(project.slug);
    }
  } catch (error) {
    console.warn(`Dynamic sitemap source unavailable; using repository projects only (${error.message}).`);
  }
}
const caseStudyRoutes = [...workProjects.map((project) => project.slug), ...dynamicSlugs].map((slug) => `/work/${slug}`);
const routes = ["/", "/services", "/work", ...caseStudyRoutes, "/process", "/start", "/terms", "/privacy"];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(routes)].map((route) => `  <url>\n    <loc>${origin}${route}</loc>\n  </url>`).join("\n")}\n</urlset>\n`;
const here = dirname(fileURLToPath(import.meta.url));
await writeFile(resolve(here, "../public/sitemap.xml"), xml, "utf8");
console.log(`Generated sitemap with ${new Set(routes).size} public routes.`);
