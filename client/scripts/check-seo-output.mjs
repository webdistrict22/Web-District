import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  PUBLIC_SEO_ROUTES,
  SERVICE_ROUTES,
  SITE_URL,
  getSeoForPath,
} from "../src/seo/seoConfig.js";
import {
  getRelatedServicesForProject,
  serviceCatalog,
} from "../src/data/servicesData.js";
import { workProjects } from "../src/data/demoProjects.js";

const distDirectory = resolve("dist");
const failures = [];
const titles = new Map();
const descriptions = new Map();
const count = (content, pattern) => content.match(pattern)?.length || 0;
const outputPathForRoute = (route) =>
  route === "/"
    ? resolve(distDirectory, "index.html")
    : resolve(distDirectory, `${route.slice(1)}.html`);
const readRoute = (route) => readFile(outputPathForRoute(route), "utf8");
const hasInternalLink = (content, path) =>
  content.includes(`href="${path}"`) || content.includes(`href="${path}/"`);

for (const route of PUBLIC_SEO_ROUTES) {
  const content = await readRoute(route);
  const seo = getSeoForPath(route, "en");
  const title = content.match(/<title>(.*?)<\/title>/s)?.[1] || "";
  const canonical = content.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const routeFailures = [];

  if (title !== seo.title.replaceAll("&", "&amp;")) routeFailures.push("title");
  if (titles.has(title)) routeFailures.push(`duplicate title with ${titles.get(title)}`);
  titles.set(title, route);
  if (descriptions.has(seo.description)) {
    routeFailures.push(`duplicate description with ${descriptions.get(seo.description)}`);
  }
  descriptions.set(seo.description, route);
  const escapedDescription = seo.description
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;");
  if (!content.includes(`content="${escapedDescription}"`)) routeFailures.push("description");
  if (canonical !== seo.canonical) routeFailures.push("canonical");
  if (count(content, /<link rel="canonical"/gi) !== 1) routeFailures.push("canonical count");
  if (count(content, /<meta name="description"/gi) !== 1) routeFailures.push("description count");
  if (count(content, /<meta name="robots"/gi) !== 1) routeFailures.push("robots count");
  if (!content.includes('name="robots" content="index,follow"')) routeFailures.push("public robots");
  if (route !== "/" && canonical?.endsWith("/")) routeFailures.push("trailing slash canonical");
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
  if (
    (route === "/" || route.startsWith("/work/") || SERVICE_ROUTES.includes(route)) &&
    !content.includes("application/ld+json")
  ) {
    routeFailures.push("JSON-LD");
  }
  if (SERVICE_ROUTES.includes(route) && !content.includes('"@type":"Service"')) {
    routeFailures.push("Service schema");
  }
  if (SERVICE_ROUTES.includes(route) && !content.includes('"@type":"BreadcrumbList"')) {
    routeFailures.push("service breadcrumb schema");
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

const homepage = await readRoute("/");
const servicesHub = await readRoute("/services");
for (const service of serviceCatalog) {
  if (!hasInternalLink(homepage, service.path)) {
    failures.push(`homepage does not link to ${service.path}`);
  }
  if (!hasInternalLink(servicesHub, service.path)) {
    failures.push(`/services does not link to ${service.path}`);
  }

  const servicePage = await readRoute(service.path);
  for (const projectSlug of service.relatedProjectSlugs) {
    if (!hasInternalLink(servicePage, `/work/${projectSlug}`)) {
      failures.push(`${service.path} does not link to /work/${projectSlug}`);
    }
  }
}

for (const project of workProjects) {
  const relatedServices = getRelatedServicesForProject(project.slug);
  if (!relatedServices.length) continue;

  const caseStudy = await readRoute(`/work/${project.slug}`);
  for (const service of relatedServices) {
    if (!hasInternalLink(caseStudy, service.path)) {
      failures.push(`/work/${project.slug} does not link to ${service.path}`);
    }
  }
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
    `SEO output verified for ${PUBLIC_SEO_ROUTES.length} public routes, service architecture, sitemap, branded 404, and private SPA shell.`,
  );
}
