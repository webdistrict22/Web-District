import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { X, UserRound } from "lucide-react";
import Button from "../common/Button";
import BrandLogo from "./BrandLogo";
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

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function MobileMenu({ isOpen, onClose, triggerRef }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { effectiveLanguage, t } = useLanguage();
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const handleTrackedNavigation = (path, buttonName) => {
    const eventName = navigationEvents[path];

    if (eventName) {
      trackCustomEvent(eventName, {
        button_name: buttonName,
        language: effectiveLanguage,
      });
    }

    onClose();
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const triggerElement = triggerRef?.current;
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll(focusableSelector)
      ).filter((element) => !element.hasAttribute("disabled"));

      if (!focusableElements.length) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);

      const focusTarget = triggerElement || previouslyFocused;
      window.requestAnimationFrame(() => focusTarget?.focus?.());
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const accountPath = isAdmin ? "/admin" : "/account";

  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-[#080808]/88 backdrop-blur-md"
      />

      <div
        ref={panelRef}
        id="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        tabIndex="-1"
        className="absolute right-4 top-4 w-[calc(100%-2rem)] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#080808] shadow-2xl"
      >
        <h2 id="mobile-menu-title" className="sr-only">
          {t("nav.mobileMenuTitle")}
        </h2>

        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3"
            aria-label="Web District"
          >
            <BrandLogo />
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#D9D4CC] transition hover:border-[#C4A77D]/40 hover:text-[#C4A77D]"
            aria-label={t("nav.closeMenu")}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="grid gap-2 p-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() =>
                handleTrackedNavigation(
                  link.path,
                  `Mobile Navigation ${link.key}`
                )
              }
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border border-[#C4A77D]/35 bg-[#C4A77D]/14 text-[#F8F7F4] shadow-[0_0_24px_rgba(196,167,125,0.10)]"
                    : "border border-transparent text-[#D9D4CC] hover:border-[#C4A77D]/25 hover:bg-white/[0.04] hover:text-[#C4A77D]"
                }`
              }
            >
              {({ isActive }) => (
                <span className="flex items-center gap-3">
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#C4A77D]" />}
                  <span>{t(`nav.links.${link.key}`, link.label)}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="grid gap-3 border-t border-white/10 p-4">
          {isAuthenticated ? (
            <Button to={accountPath} variant="secondary" icon={false} onClick={onClose}>
              <UserRound size={17} />
              {isAdmin ? t("nav.adminDashboard") : t("nav.clientAccount")}
            </Button>
          ) : (
            <Button to="/login" variant="secondary" onClick={onClose}>
              {t("nav.login")}
            </Button>
          )}

          <Button
            to="/start"
            onClick={() =>
              handleTrackedNavigation("/start", "Mobile Navigation CTA")
            }
          >
            {t("nav.startProject")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
