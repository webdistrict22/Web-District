import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  PUBLIC_SEO_ROUTES,
  getPrivateShellSeo,
} from "../src/seo/seoConfig.js";
import { renderSeoHead } from "../src/seo/renderSeoHead.js";

const here = dirname(fileURLToPath(import.meta.url));
const clientDirectory = resolve(here, "..");
const distDirectory = resolve(clientDirectory, "dist");
const serverEntry = resolve(clientDirectory, "dist-ssr/entry-server.js");
const template = await readFile(resolve(distDirectory, "index.html"), "utf8");
const { render } = await import(`${pathToFileURL(serverEntry).href}?v=${Date.now()}`);

const SEO_BLOCK = /<!--app-seo-start-->[\s\S]*?<!--app-seo-end-->/;
const EMPTY_ROOT = '<div id="root"></div>';

if (!SEO_BLOCK.test(template)) {
  throw new Error("The built HTML is missing the app SEO replacement markers.");
}
if (!template.includes(EMPTY_ROOT)) {
  throw new Error("The built HTML is missing the expected empty React root.");
}

const buildDocument = ({ appHtml = "", seo, notFound = false }) => {
  const rootAttributes = appHtml
    ? ` data-prerendered="true"${notFound ? ' data-static-not-found="true"' : ""}`
    : "";

  return template
    .replace(
      SEO_BLOCK,
      `<!--app-seo-start-->\n    ${renderSeoHead(seo)}\n    <!--app-seo-end-->`,
    )
    .replace(
      EMPTY_ROOT,
      `<div id="root"${rootAttributes}>${appHtml}</div>`,
    );
};

const outputPathForRoute = (route) =>
  route === "/"
    ? resolve(distDirectory, "index.html")
    : resolve(distDirectory, `${route.slice(1)}.html`);

for (const route of PUBLIC_SEO_ROUTES) {
  const rendered = render(route);
  if (!rendered.seo) throw new Error(`No SEO configuration found for ${route}.`);

  const outputPath = outputPathForRoute(route);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buildDocument(rendered), "utf8");
}

const notFoundPath = "/this-page-definitely-does-not-exist-xyz";
const notFound = render(notFoundPath, { notFound: true });
await writeFile(
  resolve(distDirectory, "404.html"),
  buildDocument({ ...notFound, notFound: true }),
  "utf8",
);

await writeFile(
  resolve(distDirectory, "_spa.html"),
  buildDocument({ seo: getPrivateShellSeo() }),
  "utf8",
);

console.log(
  `Prerendered ${PUBLIC_SEO_ROUTES.length} public routes plus branded 404 and private SPA shells.`,
);
