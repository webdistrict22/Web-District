import { useEffect } from "react";

const SITE_NAME = "Web District";
const BASE_URL = "https://www.web-district.com";
const DEFAULT_TITLE = "Web District | Premium Website Development Agency";
const DEFAULT_DESCRIPTION =
  "Premium websites and digital experiences for brands ready to grow online.";
const DEFAULT_IMAGE = "/icons/icon-512.png";

const toAbsoluteUrl = (value) => {
  try {
    return new URL(value || "/", BASE_URL).toString();
  } catch {
    return BASE_URL;
  }
};

const formatTitle = (title) => {
  const cleanTitle = String(title || "").trim();

  if (!cleanTitle) return DEFAULT_TITLE;

  if (
    cleanTitle === SITE_NAME ||
    cleanTitle.startsWith(`${SITE_NAME} |`) ||
    cleanTitle.endsWith(`| ${SITE_NAME}`)
  ) {
    return cleanTitle;
  }

  return `${cleanTitle} | ${SITE_NAME}`;
};

const upsertMeta = (attribute, key, content) => {
  const selector = `meta[${attribute}="${key}"]`;
  const existingTags = Array.from(document.head.querySelectorAll(selector));
  const meta = existingTags.shift() || document.createElement("meta");

  meta.setAttribute(attribute, key);
  meta.setAttribute("content", content);

  if (!meta.parentNode) {
    document.head.appendChild(meta);
  }

  existingTags.forEach((tag) => tag.remove());
};

const updateCanonical = (canonicalUrl) => {
  const existingLinks = Array.from(
    document.head.querySelectorAll('link[rel="canonical"]')
  );

  if (!canonicalUrl) {
    existingLinks.forEach((link) => link.remove());
    return;
  }

  const canonicalLink = existingLinks.shift() || document.createElement("link");

  canonicalLink.setAttribute("rel", "canonical");
  canonicalLink.setAttribute("href", canonicalUrl);

  if (!canonicalLink.parentNode) {
    document.head.appendChild(canonicalLink);
  }

  existingLinks.forEach((link) => link.remove());
};

function PageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  robots = "index,follow",
}) {
  useEffect(() => {
    const finalTitle = formatTitle(title);
    const finalDescription =
      String(description || "").trim() || DEFAULT_DESCRIPTION;
    const canonicalUrl = canonical ? toAbsoluteUrl(canonical) : "";
    const imageUrl = toAbsoluteUrl(image);
    const socialUrl = canonicalUrl || BASE_URL;

    document.title = finalTitle;

    upsertMeta("name", "description", finalDescription);
    upsertMeta("name", "robots", robots);

    upsertMeta("property", "og:title", finalTitle);
    upsertMeta("property", "og:description", finalDescription);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", socialUrl);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:image:alt", `${SITE_NAME} preview`);
    upsertMeta("property", "og:site_name", SITE_NAME);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", finalTitle);
    upsertMeta("name", "twitter:description", finalDescription);
    upsertMeta("name", "twitter:image", imageUrl);

    updateCanonical(canonicalUrl);
  }, [canonical, description, image, robots, title, type]);

  return null;
}

export default PageMeta;
