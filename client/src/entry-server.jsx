import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { getNotFoundSeo, getSeoForPath } from "./seo/seoConfig";

export function render(path, { notFound = false } = {}) {
  const appHtml = renderToString(
    <StrictMode>
      <App
        initialLanguage="en"
        initialPath={path}
        isPrerender
        staticNotFoundPath={notFound ? path : ""}
      />
    </StrictMode>,
  );

  return {
    appHtml,
    seo: notFound ? getNotFoundSeo("en") : getSeoForPath(path, "en"),
  };
}
