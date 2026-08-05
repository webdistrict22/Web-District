import { lazy, Suspense, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthProvider.jsx";
import LanguageProvider from "./context/LanguageProvider.jsx";
import SettingsProvider from "./context/SettingsProvider.jsx";
import AppRoutes from "./routes/AppRoutes";
import useLanguage from "./hooks/useLanguage";
import "./components/common/FinalCtaActions.css";

const Analytics = lazy(() => import("@vercel/analytics/react").then((module) => ({ default: module.Analytics })));
const SpeedInsights = lazy(() => import("@vercel/speed-insights/react").then((module) => ({ default: module.SpeedInsights })));

const excludePrivateAnalytics = (event) => {
  try {
    const path = new URL(event.url).pathname;
    return path === "/admin" || path.startsWith("/admin/") || path === "/account" || path.startsWith("/account/")
      ? null
      : event;
  } catch {
    return null;
  }
};

function SkipLink() {
  const { t } = useLanguage();
  const skipLinkRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    let viewportWidth = window.innerWidth;
    let viewportFrame = 0;

    const disableKeyboardNavigation = () => {
      root.classList.remove("wd-keyboard-navigation");
      if (viewportFrame) {
        window.cancelAnimationFrame(viewportFrame);
        viewportFrame = 0;
      }
    };

    const handleResize = () => {
      const nextViewportWidth = window.innerWidth;
      if (nextViewportWidth === viewportWidth) return;

      viewportWidth = nextViewportWidth;
      disableKeyboardNavigation();
      if (document.activeElement === skipLinkRef.current) {
        skipLinkRef.current.blur();
      }
    };

    const monitorViewportWidth = () => {
      viewportFrame = 0;
      handleResize();
      if (root.classList.contains("wd-keyboard-navigation")) {
        viewportFrame = window.requestAnimationFrame(monitorViewportWidth);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Tab") return;

      root.classList.add("wd-keyboard-navigation");
      if (!viewportFrame) {
        viewportFrame = window.requestAnimationFrame(monitorViewportWidth);
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("pointerdown", disableKeyboardNavigation, true);
    document.addEventListener("mousedown", disableKeyboardNavigation, true);
    document.addEventListener("touchstart", disableKeyboardNavigation, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("pointerdown", disableKeyboardNavigation, true);
      document.removeEventListener("mousedown", disableKeyboardNavigation, true);
      document.removeEventListener("touchstart", disableKeyboardNavigation, true);
      window.removeEventListener("resize", handleResize);
      disableKeyboardNavigation();
    };
  }, []);

  const focusMainContent = (event) => {
    event.preventDefault();
    document.documentElement.classList.remove("wd-keyboard-navigation");
    event.currentTarget.blur();

    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    const addedTabIndex = !mainContent.hasAttribute("tabindex");
    if (addedTabIndex) {
      mainContent.setAttribute("tabindex", "-1");
      mainContent.addEventListener(
        "blur",
        () => mainContent.removeAttribute("tabindex"),
        { once: true },
      );
    }

    mainContent.focus({ preventScroll: true });
    mainContent.scrollIntoView({ block: "start" });

    const cleanUrl = new URL(window.location.href);
    if (cleanUrl.hash === "#main-content") cleanUrl.hash = "";
    window.history.replaceState(
      window.history.state,
      "",
      `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`,
    );
  };

  return (
    <a
      ref={skipLinkRef}
      className="wd-skip-link"
      href="#main-content"
      onClick={focusMainContent}
    >
      {t("accessibility.skipToMain")}
    </a>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SettingsProvider>
          <div>
            <SkipLink />
            <AppRoutes />
          </div>

          <Toaster
            position="top-right"
            gutter={12}
            toastOptions={{
              duration: 4200,
              style: {
                background:
                  "linear-gradient(145deg, rgba(11,11,11,0.98), rgba(32,32,32,0.92))",
                color: "#F8F7F4",
                border: "1px solid rgba(196,167,125,0.28)",
                borderRadius: "18px",
                boxShadow: "0 22px 70px rgba(0,0,0,0.36)",
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: 700,
              },
              success: {
                style: {
                  border: "1px solid rgba(196,167,125,0.42)",
                  background:
                    "linear-gradient(145deg, rgba(11,11,11,0.98), rgba(168,135,79,0.16))",
                },
                iconTheme: {
                  primary: "#A8874F",
                  secondary: "#080808",
                },
              },
              error: {
                style: {
                  border: "1px solid rgba(100,19,26,0.55)",
                  background:
                    "linear-gradient(145deg, rgba(11,11,11,0.98), rgba(100,19,26,0.20))",
                },
                iconTheme: {
                  primary: "#64131A",
                  secondary: "#F8F7F4",
                },
              },
            }}
          />

          <Suspense fallback={null}>
            <Analytics beforeSend={excludePrivateAnalytics} />
            <SpeedInsights beforeSend={excludePrivateAnalytics} />
          </Suspense>
        </SettingsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
