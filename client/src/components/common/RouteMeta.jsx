import { useLocation } from "react-router";
import useLanguage from "../../hooks/useLanguage";
import { getSeoForPath } from "../../seo/seoConfig";
import PageMeta from "./PageMeta";

function RouteMeta({ path }) {
  const location = useLocation();
  const { effectiveLanguage } = useLanguage();
  const seo = getSeoForPath(path || location.pathname, effectiveLanguage);

  return seo ? <PageMeta {...seo} /> : null;
}

export default RouteMeta;
