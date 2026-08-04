import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return undefined;
    }

    const targetId = decodeURIComponent(hash.slice(1));
    let frame = 0;
    let attempts = 0;

    const scrollToHash = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }

      attempts += 1;
      if (attempts < 24) {
        frame = window.requestAnimationFrame(scrollToHash);
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    scrollToHash();
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
