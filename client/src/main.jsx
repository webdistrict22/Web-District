import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import registerServiceWorker from "./pwa/registerServiceWorker";

const rootElement = document.getElementById("root");
const isPrerendered = rootElement.dataset.prerendered === "true";
const isStaticNotFound = rootElement.dataset.staticNotFound === "true";
const app = (
  <StrictMode>
    <App
      initialLanguage={isPrerendered ? "en" : undefined}
      isPrerender={isPrerendered}
      staticNotFoundPath={isStaticNotFound ? window.location.pathname : ""}
    />
  </StrictMode>
);

if (isPrerendered) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}

registerServiceWorker();
