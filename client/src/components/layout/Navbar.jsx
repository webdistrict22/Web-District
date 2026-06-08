import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, UserRound } from "lucide-react";
import Button from "../common/Button";
import BrandLogo from "./BrandLogo";
import MobileMenu from "./MobileMenu";
import NavbarTicker from "./NavbarTicker";
import { navLinks } from "../../data/siteData";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import { trackCustomEvent } from "../../lib/metaPixel";

const navigationEvents = {
  "/services": "ServicesClick",
  "/work": "SeeWorkClick",
  "/start": "StartProjectClick",
  "/contact": "ContactClick",
};

function Navbar() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { effectiveLanguage, t, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const location = useLocation();
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const trackNavigation = (path, buttonName) => {
    const eventName = navigationEvents[path];

    if (!eventName) return;

    trackCustomEvent(eventName, {
      button_name: buttonName,
      language: effectiveLanguage,
    });
  };

  useEffect(() => {
    const timerId = window.setTimeout(closeMenu, 0);

    return () => window.clearTimeout(timerId);
  }, [closeMenu, location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#080808]/96 shadow-[0_12px_38px_rgba(0,0,0,0.24)] backdrop-blur-sm md:backdrop-blur-xl">
      <nav
        className="wd-container flex h-20 items-center justify-between"
        aria-label={t("nav.primaryNavigation")}
      >
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Web District"
        >
          <BrandLogo />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() =>
                trackNavigation(link.path, `Desktop Navigation ${link.key}`)
              }
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-[#C4A77D]/35 bg-[#C4A77D]/14 text-[#F8F7F4] shadow-[0_0_24px_rgba(196,167,125,0.10)]"
                    : "border-transparent text-[#D9D4CC] hover:border-[#C4A77D]/25 hover:bg-white/[0.03] hover:text-[#C4A77D]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#C4A77D]" />}
                  <span>{t(`nav.links.${link.key}`, link.label)}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-[#F8F7F4] transition hover:border-[#C4A77D]/40 hover:text-[#C4A77D]"
            aria-label={t("nav.languageSwitchLabel")}
          >
            {t("nav.languageToggle")}
          </button>

          {isAuthenticated && (
            <Link
              to={isAdmin ? "/admin" : "/account"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#F8F7F4] transition hover:border-[#C4A77D]/40 hover:text-[#C4A77D]"
              title={isAdmin ? t("nav.adminDashboard") : t("nav.account")}
              aria-label={
                isAdmin ? t("nav.adminDashboard") : t("nav.clientAccount")
              }
            >
              <UserRound size={18} />
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#D9D4CC] transition hover:text-[#C4A77D]"
            >
              {t("nav.login")}
            </Link>
          )}

          <Button
            to="/start"
            icon={false}
            onClick={() =>
              trackNavigation("/start", "Desktop Navigation CTA")
            }
          >
            {t("nav.startProject")}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t("nav.languageSwitchLabel")}
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs font-bold text-[#F8F7F4] transition hover:border-[#C4A77D]/40 hover:text-[#C4A77D]"
          >
            {t("nav.languageToggle")}
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label={t("nav.openMenu")}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-panel"
            aria-haspopup="dialog"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#F8F7F4] transition hover:border-[#C4A77D]/40 hover:text-[#C4A77D]"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <NavbarTicker />
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        triggerRef={menuButtonRef}
      />
    </header>
  );
}

export default Navbar;
