import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  PUBLIC_SEO_ROUTES,
  SITE_URL,
  getSeoForPath,
} from "../src/seo/seoConfig.js";

const distDirectory = resolve("dist");
const failures = [];
const titles = new Map();
const count = (content, pattern) => content.match(pattern)?.length || 0;
const outputPathForRoute = (route) =>
  route === "/"
    ? resolve(distDirectory, "index.html")
    : resolve(distDirectory, `${route.slice(1)}.html`);

for (const route of PUBLIC_SEO_ROUTES) {
  const content = await readFile(outputPathForRoute(route), "utf8");
  const seo = getSeoForPath(route, "en");
  const title = content.match(/<title>(.*?)<\/title>/s)?.[1] || "";
  const canonical = content.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const routeFailures = [];

  if (title !== seo.title.replaceAll("&", "&amp;")) routeFailures.push("title");
  if (titles.has(title)) routeFailures.push(`duplicate title with ${titles.get(title)}`);
  titles.set(title, route);
  const escapedDescription = seo.description
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;");
  if (!content.includes(`content="${escapedDescription}"`)) routeFailures.push("description");
  if (canonical !== seo.canonical) routeFailures.push("canonical");
  if (count(content, /<link rel="canonical"/gi) !== 1) routeFailures.push("canonical count");
  if (count(content, /<meta name="description"/gi) !== 1) routeFailures.push("description count");
  if (count(content, /<meta name="robots"/gi) !== 1) routeFailures.push("robots count");
  if (count(content, /<h1\b/gi) !== 1) routeFailures.push("H1 count");
  if (count(content, /<a\b[^>]*href=/gi) < 3) routeFailures.push("crawlable links");
  for (const required of [
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "og:image:width",
    "og:image:height",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
    "twitter:image:alt",
  ]) {
    if (!content.includes(`\"${required}\"`)) routeFailures.push(required);
  }
  if ((route === "/" || route.startsWith("/work/")) && !content.includes("application/ld+json")) {
    routeFailures.push("JSON-LD");
  }
  if (/localhost|web-district\.onrender\.com/i.test(content)) {
    routeFailures.push("non-production URL");
  }
  if (routeFailures.length) failures.push(`${route}: ${routeFailures.join(", ")}`);
}

const sitemap = await readFile(resolve(distDirectory, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const expectedUrls = PUBLIC_SEO_ROUTES.map((route) => `${SITE_URL}${route}`);
if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedUrls)) {
  failures.push("sitemap URLs do not exactly match the public route manifest");
}
if (/\/(?:login|signup|success|account|admin|reset-password|verify-email)/.test(sitemap)) {
  failures.push("private route found in sitemap");
}

const notFound = await readFile(resolve(distDirectory, "404.html"), "utf8");
if (!notFound.includes('content="noindex,nofollow"')) failures.push("404 noindex");
if (count(notFound, /<h1\b/gi) !== 1) failures.push("404 H1 count");
if (!notFound.includes('data-static-not-found="true"')) failures.push("404 hydration marker");

const privateShell = await readFile(resolve(distDirectory, "_spa.html"), "utf8");
if (!privateShell.includes('content="noindex,nofollow"')) failures.push("private shell noindex");
if (!privateShell.includes('<div id="root"></div>')) failures.push("private shell must have empty root");

if (failures.length) {
  console.error(`SEO output verification failed:\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(
    `SEO output verified for ${PUBLIC_SEO_ROUTES.length} public routes, sitemap, branded 404, and private SPA shell.`,
  );
}
