import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = decodeURIComponent(hash.replace("#", ""));
      let attempts = 0;

      const scrollToHash = () => {
        const target = document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return;
        }

        attempts += 1;

        if (attempts < 12) {
          window.setTimeout(scrollToHash, 50);
        }
      };

      window.setTimeout(scrollToHash, 0);
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
