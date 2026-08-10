import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import BrandLogo from "../layout/BrandLogo";
import LanguageToggle from "../layout/LanguageToggle";
import StaggeredMenu from "../reactbits/StaggeredMenu/StaggeredMenu";
import PortalLogoutDialog from "./PortalLogoutDialog";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import useMediaQuery from "../../hooks/useMediaQuery";
import { clientPortalLinks } from "./portalNavigation";

const isPortalRouteActive = (pathname, path) =>
  path === "/account" ? pathname === path : pathname.startsWith(path);

function ClientPortalNav() {
  const { logout } = useAuth();
  const { effectiveLanguage, isArabic, t } = useLanguage();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const location = useLocation();
  const navigate = useNavigate();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isCompactMenuOpen, setIsCompactMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const lastScrollYRef = useRef(0);
  const logoutDialogFrameRef = useRef(0);
  const logoutReturnFocusRef = useRef(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsHeaderHidden(false);
      setIsCompactMenuOpen(false);
      setIsLogoutDialogOpen(false);
      setIsLoggingOut(false);
      lastScrollYRef.current = Math.max(window.scrollY || 0, 0);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [effectiveLanguage, location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(window.scrollY || 0, 0);
      const lastScrollY = lastScrollYRef.current;

      if (isCompactMenuOpen || currentScrollY < 8) {
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
  }, [isCompactMenuOpen]);

  useEffect(
    () => () => {
      if (logoutDialogFrameRef.current) {
        window.cancelAnimationFrame(logoutDialogFrameRef.current);
      }
    },
    [],
  );

  const selectRoute = (path) => (event) => {
    event.preventDefault();
    navigate(path);
  };

  const requestLogout = (event) => {
    event.preventDefault();
    const compactMenu = event.currentTarget.closest(".wd-portal-staggered-menu");
    logoutReturnFocusRef.current = compactMenu
      ? compactMenu.querySelector(".sm-toggle")
      : event.currentTarget;
    setIsHeaderHidden(false);

    if (compactMenu) {
      if (logoutDialogFrameRef.current) {
        window.cancelAnimationFrame(logoutDialogFrameRef.current);
      }
      logoutDialogFrameRef.current = window.requestAnimationFrame(() => {
        logoutDialogFrameRef.current = 0;
        setIsLogoutDialogOpen(true);
      });
      return;
    }

    setIsLogoutDialogOpen(true);
  };

  const cancelLogout = () => {
    if (!isLoggingOut) setIsLogoutDialogOpen(false);
  };

  const confirmLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLogoutDialogOpen(false);
      setIsLoggingOut(false);
    }
  };

  const compactItems = [
    ...clientPortalLinks.map((link) => ({
      label: t(`client.layout.links.${link.key}`, link.label),
      ariaLabel: t(`client.layout.links.${link.key}`, link.label),
      link: link.path,
      active: isPortalRouteActive(location.pathname, link.path),
      onSelect: selectRoute(link.path),
    })),
    {
      label: t("client.layout.goHome"),
      ariaLabel: t("client.layout.goHome"),
      link: "/",
      variant: "primary",
      onSelect: selectRoute("/"),
    },
    {
      label: t("client.layout.logout"),
      ariaLabel: t("client.layout.logout"),
      link: "#portal-logout",
      variant: "utility",
      onSelect: requestLogout,
    },
  ];

  return (
    <>
      <header
        className={`wd-portal-header-stack${isHeaderHidden ? " is-hidden" : ""}`}
        onFocusCapture={() => setIsHeaderHidden(false)}
      >
        <div className="wd-portal-nav-desktop">
          <nav className="wd-portal-nav-desktop__inner" aria-label={t("client.layout.navigationLabel")}>
            <Link to="/account" className="wd-portal-brand" aria-label={t("client.layout.portalHomeLabel")}>
              <BrandLogo showText={false} />
              <span>{t("client.layout.portal")}</span>
            </Link>

            <div className="wd-portal-nav-links">
              {clientPortalLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/account"}
                  className={({ isActive }) =>
                    `wd-portal-nav-link${isActive ? " is-active" : ""}`
                  }
                >
                  {t(`client.layout.links.${link.key}`, link.label)}
                </NavLink>
              ))}
            </div>

            <div className="wd-portal-nav-utilities">
              <Link to="/" className="wd-portal-home-action">
                {t("client.layout.goHome")}
              </Link>
              <button type="button" className="wd-portal-logout" onClick={requestLogout}>
                {t("client.layout.logout")}
              </button>
            </div>
          </nav>
        </div>

        <div className="wd-portal-nav-compact">
          <StaggeredMenu
            key={`${effectiveLanguage}-${location.pathname}`}
            className="wd-portal-staggered-menu"
            position={isArabic ? "left" : "right"}
            colors={["#B88A45", "#D6A75D"]}
            items={compactItems}
            displaySocials={false}
            displayItemNumbering={false}
            logoUrl="/images/logo/web-district-logo.webp"
            logoAlt="Web District"
            logoLink="/account"
            menuButtonColor="#F7F2EC"
            openMenuButtonColor="#F7F2EC"
            accentColor="#D6A75D"
            openMenuLabel={t("client.layout.openMenu")}
            closeMenuLabel={t("client.layout.closeMenu")}
            headerAriaLabel={t("client.layout.navigationLabel")}
            panelAriaLabel={t("client.layout.mobileMenuLabel")}
            reducedMotion={reducedMotion}
            onLogoClick={selectRoute("/account")}
            onMenuOpen={() => {
              setIsCompactMenuOpen(true);
              setIsHeaderHidden(false);
            }}
            onMenuClose={() => setIsCompactMenuOpen(false)}
          />
        </div>
      </header>

      <LanguageToggle />
      <PortalLogoutDialog
        open={isLogoutDialogOpen}
        title={t("client.layout.logoutDialog.title")}
        message={t("client.layout.logoutDialog.message")}
        cancelText={t("client.layout.logoutDialog.cancel")}
        confirmText={t("client.layout.logoutDialog.confirm")}
        loadingText={t("client.layout.logoutDialog.loading")}
        closeLabel={t("client.layout.logoutDialog.close")}
        isSubmitting={isLoggingOut}
        returnFocusRef={logoutReturnFocusRef}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />
    </>
  );
}

export default ClientPortalNav;
