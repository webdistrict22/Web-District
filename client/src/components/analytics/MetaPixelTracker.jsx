import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import {
  initMetaPixel,
  trackCustomEvent,
  trackPageView,
  trackViewContent,
} from "../../lib/metaPixel";

const trackedPublicPaths = new Set([
  "/",
  "/services",
  "/work",
  "/process",
  "/start",
  "/contact",
  "/success",
  "/terms",
  "/privacy",
]);

const publicPageViews = {
  "/": { contentName: "Home", contentCategory: "Public Page" },
  "/services": {
    contentName: "Services",
    contentCategory: "Public Page",
  },
  "/work": { contentName: "Work", contentCategory: "Public Page" },
  "/start": {
    contentName: "Start Project",
    contentCategory: "Public Page",
  },
  "/contact": { contentName: "Contact", contentCategory: "Public Page" },
  "/process": { contentName: "Process", contentCategory: "Public Page" },
};

const caseStudyViews = {
  zohour: "Zohour Case Study",
  "s8-factory": "S8 Factory Case Study",
  atheer: "Atheer Case Study",
  akm: "AKM Case Study",
};

let lastTrackedPath = "";

const normalizePath = (pathname) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

const getCaseStudyConfig = (path) => {
  const match = path.match(/^\/work\/([^/]+)$/);

  if (!match) return null;

  let projectSlug;

  try {
    projectSlug = decodeURIComponent(match[1]);
  } catch {
    return null;
  }

  const contentName = caseStudyViews[projectSlug];

  if (!contentName) return null;

  return {
    contentName,
    contentCategory: "Case Study",
    projectSlug,
  };
};

function MetaPixelTracker() {
  const location = useLocation();
  const { effectiveLanguage } = useLanguage();

  useEffect(() => {
    const path = normalizePath(location.pathname);
    const caseStudyConfig = getCaseStudyConfig(path);
    const isCaseStudyPath = /^\/work\/[^/]+$/.test(path);
    const isTrackedPath = trackedPublicPaths.has(path) || isCaseStudyPath;

    if (!isTrackedPath) {
      lastTrackedPath = "";
      return undefined;
    }

    if (lastTrackedPath === path) return undefined;

    const timerId = window.setTimeout(() => {
      if (lastTrackedPath === path || !initMetaPixel()) return;

      const viewConfig = publicPageViews[path] || caseStudyConfig;
      const eventParams = {
        page_path: path,
        page_title: viewConfig?.contentName || document.title,
        language: effectiveLanguage,
      };

      if (!trackPageView(eventParams)) return;

      lastTrackedPath = path;

      if (!viewConfig) return;

      const viewParams = {
        ...eventParams,
        content_category: viewConfig.contentCategory,
      };

      if (viewConfig.projectSlug) {
        viewParams.project_slug = viewConfig.projectSlug;
      }

      trackViewContent(viewConfig.contentName, viewParams);

      if (viewConfig.projectSlug) {
        trackCustomEvent("ProjectCaseStudyView", {
          ...viewParams,
          content_name: viewConfig.contentName,
        });
      }
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [effectiveLanguage, location.pathname]);

  return null;
}

export default MetaPixelTracker;
