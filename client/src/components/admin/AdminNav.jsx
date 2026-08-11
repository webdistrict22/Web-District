import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import BrandLogo from "../layout/BrandLogo";
import StaggeredMenu from "../reactbits/StaggeredMenu/StaggeredMenu";
import PortalLogoutDialog from "../portal/PortalLogoutDialog";
import useAuth from "../../hooks/useAuth";
import useMediaQuery from "../../hooks/useMediaQuery";
import { adminLinks, isAdminRouteActive } from "./adminNavigation";

function AdminNav() {
  const { logout } = useAuth();
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
  }, [location.pathname]);

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
    const compactMenu = event.currentTarget.closest(".wd-admin-staggered-menu");
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
    ...adminLinks.map((link) => ({
      label: link.label,
      ariaLabel: link.label,
      link: link.path,
      active: isAdminRouteActive(location.pathname, link.path),
      onSelect: selectRoute(link.path),
    })),
    {
      label: "Go Home",
      ariaLabel: "Go Home",
      link: "/",
      variant: "primary",
      onSelect: selectRoute("/"),
    },
    {
      label: "Logout",
      ariaLabel: "Logout",
      link: "#admin-logout",
      variant: "utility",
      onSelect: requestLogout,
    },
  ];

  return (
    <>
      <header
        className={`wd-admin-header-stack${isHeaderHidden ? " is-hidden" : ""}`}
        onFocusCapture={() => setIsHeaderHidden(false)}
      >
        <div className="wd-admin-nav-desktop">
          <nav className="wd-admin-nav-desktop__inner" aria-label="Admin navigation">
            <Link to="/admin" className="wd-admin-brand" aria-label="Admin overview">
              <BrandLogo showText={false} />
              <span>Admin</span>
            </Link>

            <div className="wd-admin-nav-links">
              {adminLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/admin"}
                  className={() =>
                    `wd-admin-nav-link${
                      isAdminRouteActive(location.pathname, link.path)
                        ? " is-active"
                        : ""
                    }`
                  }
                  aria-current={
                    isAdminRouteActive(location.pathname, link.path)
                      ? "page"
                      : undefined
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="wd-admin-nav-utilities">
              <Link to="/" className="wd-admin-home-action">
                Go Home
              </Link>
              <button type="button" className="wd-admin-logout" onClick={requestLogout}>
                Logout
              </button>
            </div>
          </nav>
        </div>

        <div className="wd-admin-nav-compact">
          <StaggeredMenu
            key={location.pathname}
            className="wd-admin-staggered-menu"
            position="right"
            colors={["#B88A45", "#D6A75D"]}
            items={compactItems}
            displaySocials={false}
            displayItemNumbering={false}
            logoUrl="/images/logo/web-district-logo.webp"
            logoAlt="Web District"
            logoLink="/admin"
            menuButtonColor="#F7F2EC"
            openMenuButtonColor="#F7F2EC"
            accentColor="#D6A75D"
            openMenuLabel="Open Admin menu"
            closeMenuLabel="Close Admin menu"
            headerAriaLabel="Admin navigation header"
            panelAriaLabel="Admin mobile navigation"
            reducedMotion={reducedMotion}
            onLogoClick={selectRoute("/admin")}
            onMenuOpen={() => {
              setIsCompactMenuOpen(true);
              setIsHeaderHidden(false);
            }}
            onMenuClose={() => setIsCompactMenuOpen(false)}
          />
        </div>
      </header>

      <PortalLogoutDialog
        open={isLogoutDialogOpen}
        title="Log out of Admin?"
        message="You will need to sign in again to manage the Web District platform."
        cancelText="Cancel"
        confirmText="Log out"
        loadingText="Logging out..."
        closeLabel="Close logout confirmation"
        isSubmitting={isLoggingOut}
        returnFocusRef={logoutReturnFocusRef}
        onCancel={cancelLogout}
        onConfirm={confirmLogout}
      />
    </>
  );
}

export default AdminNav;
