import { Link, NavLink } from "react-router-dom";
import { X, UserRound } from "lucide-react";
import Button from "../common/Button";
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
        className="absolute inset-0 bg-[#020817]/80 backdrop-blur-md"
      />

      <div className="absolute right-4 top-4 w-[calc(100%-2rem)] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0A1A2D] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <Link to="/" onClick={onClose} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C69A4E]/25 bg-[#020817]">
              <span className="font-display text-sm font-black tracking-[-0.08em] text-[#F5F8FC]">
                WD
              </span>
            </div>

            <div>
              <p className="font-display text-lg font-bold tracking-[-0.04em] text-white">
                Web District
              </p>
              <p className="text-xs text-[#94A3B8]">Premium Web Studio</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#94A3B8]"
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
                    ? "bg-[#C69A4E]/15 text-[#F1D08B]"
                    : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              {link.label}
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
            Book your website
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;