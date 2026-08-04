import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import NavbarTicker from "./NavbarTicker";
import PillNav from "../reactbits/PillNav/PillNav";
import StaggeredMenu from "../reactbits/StaggeredMenu/StaggeredMenu";
import { navLinks } from "../../data/siteData";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import useMediaQuery from "../../hooks/useMediaQuery";
import { trackCustomEvent } from "../../lib/metaPixel";

const navigationEvents = {
  "/services": "ServicesClick",
  "/work": "SeeWorkClick",
  "/start": "StartProjectClick",
};

const routeLinks = navLinks;

const isRouteActive = (pathname, path) => {
  if (path === "/") return pathname === "/";
  if (path === "/work") return pathname === "/work" || pathname.startsWith("/work/");
  return pathname === path;
};

function Navbar() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { effectiveLanguage, isArabic, t } = useLanguage();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const location = useLocation();
  const navigate = useNavigate();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const accountPath = isAdmin ? "/admin" : "/account";
  const clientPath = isAuthenticated ? accountPath : "/login";
  const clientLabel = isAuthenticated
    ? isAdmin
      ? t("nav.adminDashboard")
      : t("nav.account")
    : t("nav.login");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsHeaderHidden(false);
      setIsMobileMenuOpen(false);
      lastScrollYRef.current = Math.max(window.scrollY || 0, 0);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [effectiveLanguage, location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(window.scrollY || 0, 0);
      const lastScrollY = lastScrollYRef.current;

      if (isMobileMenuOpen || currentScrollY < 8) {
        setIsHeaderHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY;
      if (Math.abs(delta) < 8) return;

      setIsHeaderHidden(delta > 0 && currentScrollY > 96);
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  const trackNavigation = useCallback(
    (path, buttonName) => {
      const eventName = navigationEvents[path];
      if (!eventName) return;
      trackCustomEvent(eventName, {
        button_name: buttonName,
        language: effectiveLanguage,
      });
    },
    [effectiveLanguage],
  );

  const selectRoute = (path, buttonName) => (event) => {
    event.preventDefault();
    trackNavigation(path, buttonName);
    navigate(path);
  };

  const pillItems = useMemo(
    () =>
      routeLinks.map((link) => ({
        label: t(`nav.links.${link.key}`, link.label),
        ariaLabel: t(`nav.links.${link.key}`, link.label),
        href: link.path,
        onSelect: () =>
          trackNavigation(link.path, `Desktop Navigation ${link.key}`),
      })),
    [t, trackNavigation],
  );

  const compactRouteItems = routeLinks.map((link) => ({
    label: t(`nav.links.${link.key}`, link.label),
    ariaLabel: t(`nav.links.${link.key}`, link.label),
    link: link.path,
    active: isRouteActive(location.pathname, link.path),
    onSelect: selectRoute(link.path, `Mobile Navigation ${link.key}`),
  }));
  const compactItems = [
    ...compactRouteItems,
    {
      label: t("nav.startProject"),
      ariaLabel: t("nav.startProject"),
      link: "/start",
      active: location.pathname === "/start",
      variant: "primary",
      onSelect: selectRoute("/start", "Mobile Navigation CTA"),
    },
    {
      label: clientLabel,
      ariaLabel: clientLabel,
      link: clientPath,
      active:
        location.pathname === clientPath ||
        (clientPath === "/account" && location.pathname.startsWith("/account")),
      variant: "utility",
      onSelect: selectRoute(clientPath, "Mobile Navigation Client Action"),
    },
  ];

  return (
    <header
      className={`wd-public-header-stack pointer-events-none fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out will-change-transform ${
          isHeaderHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      onFocusCapture={() => setIsHeaderHidden(false)}
    >
      <NavbarTicker />

      <div className="pointer-events-auto hidden h-20 border-b border-[#D6A75D]/15 bg-[#050505]/96 backdrop-blur-xl min-[1366px]:block">
        <nav
          className="mx-auto flex h-full w-[min(1280px,calc(100%-48px))] items-center justify-between gap-5"
          aria-label={t("nav.primaryNavigation")}
        >
          <Link to="/" className="shrink-0" aria-label="Web District">
            <BrandLogo showText={false} />
          </Link>

          <div className="min-w-0">
            <PillNav
              items={pillItems}
              activeHref={location.pathname}
              baseColor="#D6A75D"
              pillColor="transparent"
              hoveredPillTextColor="#171411"
              pillTextColor="#F7F2EC"
              ease="power2.easeOut"
              initialLoadAnimation={false}
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              to={clientPath}
              className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-[9px] border border-[#F7F2EC]/14 bg-[#0C0B0A]/72 px-4 py-2 text-sm font-semibold text-[#F7F2EC] transition hover:border-[#D6A75D]/65 hover:bg-[#D6A75D]/10 hover:text-[#E7C87A] focus-visible:border-[#D6A75D] focus-visible:text-[#E7C87A] active:translate-y-px"
            >
              {clientLabel}
            </Link>
            <Link
              to="/start"
              onClick={() =>
                trackNavigation("/start", "Desktop Navigation CTA")
              }
              style={{ color: "#171411" }}
              className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] bg-[#D6A75D] px-5 py-3 text-sm font-bold text-[#171411] transition hover:bg-[#E7C87A] active:translate-y-px"
            >
              {t("nav.startProject")}
            </Link>
          </div>
        </nav>
      </div>

      <div
        className="h-[calc(100dvh-28px)] min-[1366px]:hidden"
      >
        <StaggeredMenu
          key={`${effectiveLanguage}-${location.pathname}`}
          position={isArabic ? "left" : "right"}
          colors={["#B88A45", "#D6A75D"]}
          items={compactItems}
          displaySocials={false}
          displayItemNumbering={false}
          logoUrl="/images/logo/web-district-logo.webp"
          logoAlt="Web District"
          logoLink="/"
          menuButtonColor="#F7F2EC"
          openMenuButtonColor="#F7F2EC"
          accentColor="#D6A75D"
          openMenuLabel={t("nav.openMenu")}
          closeMenuLabel={t("nav.closeMenu")}
          headerAriaLabel={t("nav.primaryNavigation")}
          panelAriaLabel={t("nav.mobileMenuTitle")}
          reducedMotion={reducedMotion}
          onLogoClick={selectRoute("/", "Mobile Navigation Logo")}
          onMenuOpen={() => {
            setIsMobileMenuOpen(true);
            setIsHeaderHidden(false);
          }}
          onMenuClose={() => setIsMobileMenuOpen(false)}
        />
      </div>
    </header>
  );
}

export default Navbar;
