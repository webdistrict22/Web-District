import { useEffect } from "react";
import { useLocation } from "react-router";
import useLanguage from "../../hooks/useLanguage";
import { getFallbackProjectBySlug } from "../../data/demoProjects";
import { getServiceBySlug } from "../../data/servicesData";
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
  "/process": { contentName: "Process", contentCategory: "Public Page" },
};

let lastTrackedPath = "";

const normalizePath = (pathname) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

const decodeRouteSegment = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
};

const getCaseStudyConfig = (path) => {
  const match = path.match(/^\/work\/([^/]+)$/);
  if (!match) return null;

  const projectSlug = decodeRouteSegment(match[1]);
  if (!projectSlug) return null;

  const project = getFallbackProjectBySlug(projectSlug);
  if (!project) return null;

  return {
    contentName: project.name || project.title || projectSlug,
    contentCategory: "Case Study",
    projectSlug,
  };
};

const getServiceDetailConfig = (path, language) => {
  const match = path.match(/^\/services\/([^/]+)$/);
  if (!match) return null;

  const serviceSlug = decodeRouteSegment(match[1]);
  if (!serviceSlug) return null;

  const service = getServiceBySlug(serviceSlug);
  if (!service) return null;

  const page = service.page?.[language] || service.page?.en;

  return {
    contentName: page?.name || service.serviceType || serviceSlug,
    contentCategory: "Service",
  };
};

function MetaPixelTracker() {
  const location = useLocation();
  const { effectiveLanguage } = useLanguage();

  useEffect(() => {
    const path = normalizePath(location.pathname);
    const caseStudyConfig = getCaseStudyConfig(path);
    const serviceDetailConfig = getServiceDetailConfig(
      path,
      effectiveLanguage,
    );
    const isCaseStudyPath = /^\/work\/[^/]+$/.test(path);
    const isTrackedPath =
      trackedPublicPaths.has(path) ||
      isCaseStudyPath ||
      Boolean(serviceDetailConfig);

    if (!isTrackedPath) {
      lastTrackedPath = "";
      return undefined;
    }

    if (lastTrackedPath === path) return undefined;

    const timerId = window.setTimeout(() => {
      if (lastTrackedPath === path || !initMetaPixel()) return;

      const viewConfig =
        publicPageViews[path] ||
        caseStudyConfig ||
        serviceDetailConfig;

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

      if (caseStudyConfig?.projectSlug) {
        viewParams.project_slug = caseStudyConfig.projectSlug;
      }

      trackViewContent(viewConfig.contentName, viewParams);

      if (caseStudyConfig?.projectSlug) {
        trackCustomEvent("ProjectCaseStudyView", {
          ...viewParams,
          content_name: viewConfig.contentName,
        });
      }

      if (serviceDetailConfig) {
        trackCustomEvent("ServicePageView", {
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
