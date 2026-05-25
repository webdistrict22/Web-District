import { Link, NavLink } from "react-router-dom";
import { X, UserRound } from "lucide-react";
import Button from "../common/Button";
import BrandLogo from "./BrandLogo";
import { navLinks } from "../../data/siteData";
import useAuth from "../../hooks/useAuth";

function MobileMenu({ isOpen, onClose }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isOpen) return null;

  const accountPath = isAdmin ? "/admin" : "/account";

  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <button
        type="button"
        aria-label="Close mobile menu overlay"
        onClick={onClose}
        className="absolute inset-0 bg-[#080808]/88 backdrop-blur-md"
      />

      <div className="absolute right-4 top-4 w-[calc(100%-2rem)] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#080808] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <Link to="/" onClick={onClose} className="flex items-center gap-3">
            <BrandLogo />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#D9D4CC] transition hover:border-[#C4A77D]/40 hover:text-[#C4A77D]"
            aria-label="Close mobile menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="grid gap-2 p-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
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
                  <span>{link.label}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="grid gap-3 border-t border-white/10 p-4">
          {isAuthenticated ? (
            <Button to={accountPath} variant="secondary" icon={false} onClick={onClose}>
              <UserRound size={17} />
              {isAdmin ? "Admin dashboard" : "Client account"}
            </Button>
          ) : (
            <Button to="/login" variant="secondary" onClick={onClose}>
              Login
            </Button>
          )}

          <Button to="/start" onClick={onClose}>
            Start Your Project
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
