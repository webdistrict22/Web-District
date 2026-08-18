const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const meta = (attribute, name, content) =>
  content === undefined || content === null || content === ""
    ? ""
    : `<meta ${attribute}="${escapeHtml(name)}" content="${escapeHtml(content)}" />`;

export const renderSeoHead = (seo) => {
  if (!seo) throw new Error("SEO data is required to render a document head.");

  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    meta("name", "description", seo.description),
    meta("name", "robots", seo.robots || "index,follow"),
    seo.canonical
      ? `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`
      : "",
    meta("property", "og:title", seo.title),
    meta("property", "og:description", seo.description),
    meta("property", "og:type", seo.ogType || "website"),
    meta("property", "og:url", seo.canonical),
    meta("property", "og:image", seo.image),
    meta("property", "og:image:alt", seo.imageAlt),
    meta("property", "og:image:width", seo.imageWidth),
    meta("property", "og:image:height", seo.imageHeight),
    meta("property", "og:site_name", "Web District"),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", seo.title),
    meta("name", "twitter:description", seo.description),
    meta("name", "twitter:image", seo.image),
    meta("name", "twitter:image:alt", seo.imageAlt),
    seo.structuredData
      ? `<script id="web-district-structured-data" type="application/ld+json">${JSON.stringify(
          seo.structuredData,
        ).replace(/</g, "\\u003c")}</script>`
      : "",
  ];

  return tags.filter(Boolean).join("\n    ");
};

export default renderSeoHead;
