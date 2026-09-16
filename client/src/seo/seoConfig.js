import { translations } from "../i18n/translations.js";
import { workProjects } from "../data/demoProjects.js";
import {
  serviceByPath,
  serviceCatalog,
} from "../data/servicesData.js";
import { getImageMetadata } from "../data/imageMetadata.js";

export const SITE_NAME = "Web District";
export const SITE_URL = "https://www.web-district.com";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const DEFAULT_IMAGE = "/images/home/desktop-home-hero.webp";
export const DEFAULT_IMAGE_ALT = "Web District web design and development agency";

const staticEnglishSeo = {
  "/": {
    title: "Web Design & Development Agency in Egypt | Web District",
    description:
      "Web District is a web design and development agency in Egypt creating online stores, business websites, landing pages, booking sites, and custom platforms.",
  },
  "/services": {
    title: "Web Design & Development Services Egypt | Web District",
    description:
      "Explore Web District’s web design and development services in Egypt, including e-commerce, business websites, landing pages, booking sites, and custom platforms.",
  },
  "/work": {
    title: "Website Design Portfolio & Case Studies | Web District",
    description:
      "Explore Web District case studies across e-commerce stores, business websites, booking experiences, and custom platforms built for real brands.",
  },
  "/process": {
    title: "Our Website Design & Development Process | Web District",
    description:
      "See Web District’s five-stage website design and development process, from discovery and planning through design, development, launch, and support.",
  },
  "/start": {
    title: "Start Your Website Project | Web District",
    description:
      "Start your website project with Web District in Egypt. Share your requirements or book a call to plan the right website, online store, or custom platform.",
  },
  "/terms": {
    title: "Terms & Conditions | Web District",
    description: translations.en.legal.terms.metaDescription,
  },
  "/privacy": {
    title: "Privacy Policy | Web District",
    description: translations.en.legal.privacy.metaDescription,
  },
};

const caseStudyEnglishSeo = {
  darb: {
    title: "Darb Perfume E-commerce Case Study | Web District",
    description:
      "See how Web District shaped Darb's perfume e-commerce experience around fragrance discovery, checkout, order tracking, store management, and a polished brand-led storefront.",
  },
  wam: {
    title: "Wish A Mesh 3D Printing Website Case Study | Web District",
    description:
      "Explore Wish A Mesh, a 3D-printing commerce platform combining ready-made products, custom requests, model uploads, checkout, tracking, accounts, and admin workflows.",
  },
  "burn-gym": {
    title: "Burn Gym Custom Dashboard Case Study | Web District",
    description:
      "Explore Burn Gym, a custom gym-management dashboard by Web District that centralizes members, memberships, coaches, classes, attendance, payments, and daily operations.",
  },

  zohour: {
    title: "Zohour E-commerce Website Case Study | Web District",
    description:
      "See how Web District built Zohour’s floral cap e-commerce store, from product discovery and checkout to customer orders and store operations.",
  },
  "s8-factory": {
    title: "S8 Factory Business Website Case Study | Web District",
    description:
      "Explore the business website and production platform Web District built for S8 Factory, including enquiries, appointments, samples, contracts, and admin workflows.",
  },
  atheer: {
    title: "Atheer Perfume E-commerce Case Study | Web District",
    description:
      "See how Web District created Atheer’s luxury perfume e-commerce experience, with fragrance discovery, checkout, order tracking, and store management.",
  },
  akm: {
    title: "AKM Fashion E-commerce Case Study | Web District",
    description:
      "Explore AKM’s fashion e-commerce case study, including product variants, bundles, Arabic support, checkout, customer orders, and admin operations.",
  },
  davinto: {
    title: "Davinto Fashion E-commerce Case Study | Web District",
    description:
      "See how Web District developed Davinto’s responsive fashion e-commerce store, with product-led browsing, bundles, checkout, tracking, and bilingual management.",
  },
  "salah-frame": {
    title: "Salah Frame E-commerce Case Study | Web District",
    description:
      "Explore Salah Frame’s custom-frame e-commerce experience, covering more than 200 products, customization, bundles, checkout, and Shopify operations.",
  },
  "fresh-cart": {
    title: "Fresh Cart E-commerce Case Study | Web District",
    description:
      "See how Web District structured Fresh Cart’s large-catalog grocery store for fast product discovery, mobile ordering, checkout, and repeat purchases.",
  },
  travco: {
    title: "Travco Travel Booking Website Case Study | Web District",
    description:
      "Explore Travco’s travel website and booking flow, including package discovery, booking requests, customer accounts, payments, and reservation management.",
  },
  byjojo: {
    title: "ByJojo E-commerce Website Case Study | Web District",
    description:
      "Explore ByJojo’s e-commerce website case study by Web District, focused on product discovery, ordering, and a polished branded shopping experience.",
  },
  "ms-store": {
    title: "MS Store E-commerce Website Case Study | Web District",
    description:
      "See how Web District built MS Store’s online catalog and ordering experience, including product discovery, checkout, customer accounts, and order tracking.",
  },
};

const staticArabicSeo = {
  "/": {
    title: `${translations.ar.home.metaTitle} | Web District`,
    description: translations.ar.home.metaDescription,
  },
  "/services": {
    title: `${translations.ar.services.metaTitle} | Web District`,
    description: translations.ar.services.metaDescription,
  },
  "/work": {
    title: `${translations.ar.work.hero.eyebrow} | Web District`,
    description: translations.ar.work.hero.description,
  },
  "/process": {
    title: `${translations.ar.process.hero.eyebrow} | Web District`,
    description: translations.ar.process.hero.description,
  },
  "/start": {
    title: `${translations.ar.start.hero.eyebrow} | Web District`,
    description: translations.ar.start.hero.description,
  },
  "/terms": {
    title: `${translations.ar.legal.terms.metaTitle} | Web District`,
    description: translations.ar.legal.terms.metaDescription,
  },
  "/privacy": {
    title: `${translations.ar.legal.privacy.metaTitle} | Web District`,
    description: translations.ar.legal.privacy.metaDescription,
  },
};

const projectBySlug = new Map(workProjects.map((project) => [project.slug, project]));
const staticRoutes = Object.keys(staticEnglishSeo);

export const SERVICE_ROUTES = serviceCatalog.map((item) => item.path);
export const CASE_STUDY_ROUTES = workProjects.map(
  (project) => `/work/${project.slug}`,
);
export const PUBLIC_SEO_ROUTES = [
  ...staticRoutes,
  ...SERVICE_ROUTES,
  ...CASE_STUDY_ROUTES,
];

export const normalizeSeoPath = (value = "/") => {
  const pathname = String(value).split(/[?#]/, 1)[0] || "/";
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
};

export const toAbsoluteUrl = (value = "/") => new URL(value, SITE_URL).toString();

const organizationNode = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo/web-district-logo.webp`,
    width: 1254,
    height: 1254,
  },
  email: "web.district22@gmail.com",
  telephone: "01130696935",
  sameAs: ["https://www.instagram.com/web__district"],
  areaServed: {
    "@type": "Country",
    name: "Egypt",
  },
};

const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  publisher: { "@id": ORGANIZATION_ID },
  inLanguage: ["en", "ar"],
};

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [organizationNode, websiteNode],
};

const withDefaultImageMetadata = (seo) => {
  const { width: imageWidth, height: imageHeight } = getImageMetadata(DEFAULT_IMAGE);
  return {
    ...seo,
    image: toAbsoluteUrl(DEFAULT_IMAGE),
    imageAlt: DEFAULT_IMAGE_ALT,
    imageWidth,
    imageHeight,
  };
};

export const getServiceSeo = (service, language = "en") => {
  if (!service) return null;

  const locale = language === "ar" ? "ar" : "en";
  const localized = service.seo[locale] || service.seo.en;
  const page = service.page[locale] || service.page.en;
  const canonical = toAbsoluteUrl(service.path);
  const homeName = locale === "ar" ? "الرئيسية" : "Home";
  const servicesName = locale === "ar" ? "الخدمات" : "Services";

  return withDefaultImageMetadata({
    ...localized,
    canonical,
    robots: "index,follow",
    ogType: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        organizationNode,
        {
          "@type": "Service",
          "@id": `${canonical}#service`,
          name: page.name,
          serviceType: service.serviceType,
          description: localized.description,
          url: canonical,
          provider: { "@id": ORGANIZATION_ID },
          areaServed: {
            "@type": "Country",
            name: "Egypt",
          },
          inLanguage: locale,
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: homeName,
              item: `${SITE_URL}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: servicesName,
              item: `${SITE_URL}/services`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: page.name,
              item: canonical,
            },
          ],
        },
      ],
    },
  });
};

const getArabicProjectDescription = (project) => {
  const translated = translations.ar.work.projects?.[project.slug];
  return translated?.overview || translated?.description || project.description;
};

export const getCaseStudySeo = (project, language = "en") => {
  if (!project?.slug) return null;

  const path = `/work/${project.slug}`;
  const canonical = toAbsoluteUrl(path);
  const name = project.title || project.name;
  const approved = caseStudyEnglishSeo[project.slug];
  const englishDescription =
    approved?.description ||
    project.fullDescription ||
    project.shortDescription ||
    project.overview ||
    project.description;
  const title = language === "ar"
    ? `${name} ${translations.ar.work.caseStudy.eyebrow} | Web District`
    : approved?.title || `${name} Website Case Study | Web District`;
  const description = language === "ar"
    ? getArabicProjectDescription(project)
    : englishDescription;
  const image = project.coverImage || project.images?.[0] || DEFAULT_IMAGE;
  const { width: imageWidth, height: imageHeight } = getImageMetadata(image);
  const imageUrl = toAbsoluteUrl(image);
  const category = project.websiteType || project.type || project.businessType;

  return {
    title,
    description,
    canonical,
    robots: "index,follow",
    ogType: "article",
    image: imageUrl,
    imageAlt: `${name} website case study by Web District`,
    imageWidth,
    imageHeight,
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        organizationNode,
        {
          "@type": "CreativeWork",
          "@id": `${canonical}#project`,
          name,
          description,
          url: canonical,
          image: imageUrl,
          creator: { "@id": ORGANIZATION_ID },
          provider: { "@id": ORGANIZATION_ID },
          ...(category ? { genre: category } : {}),
          inLanguage: language,
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${SITE_URL}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Work",
              item: `${SITE_URL}/work`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name,
              item: canonical,
            },
          ],
        },
      ],
    },
  };
};

export const getSeoForPath = (value, language = "en") => {
  const path = normalizeSeoPath(value);
  const service = serviceByPath.get(path);
  if (service) return getServiceSeo(service, language);

  const caseStudyMatch = path.match(/^\/work\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);

  if (caseStudyMatch) {
    return getCaseStudySeo(projectBySlug.get(caseStudyMatch[1]), language);
  }

  const localized = language === "ar" ? staticArabicSeo[path] : staticEnglishSeo[path];
  if (!localized) return null;

  const canonical = toAbsoluteUrl(path);

  return withDefaultImageMetadata({
    ...localized,
    canonical,
    robots: "index,follow",
    ogType: "website",
    structuredData: path === "/" ? homeStructuredData : undefined,
  });
};

export const getNotFoundSeo = (language = "en") =>
  withDefaultImageMetadata({
    title:
      language === "ar"
        ? `${translations.ar.notFound.metaTitle} | Web District`
        : "Page Not Found | Web District",
    description:
      language === "ar"
        ? translations.ar.notFound.metaDescription
        : translations.en.notFound.metaDescription,
    robots: "noindex,nofollow",
    ogType: "website",
  });

export const getPrivateShellSeo = () =>
  withDefaultImageMetadata({
    title: "Web District",
    description: translations.en.home.metaDescription,
    robots: "noindex,nofollow",
    ogType: "website",
  });
