import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, UserRound } from "lucide-react";
import Button from "../common/Button";
import BrandLogo from "./BrandLogo";
import MobileMenu from "./MobileMenu";
import NavbarTicker from "./NavbarTicker";
import { navLinks } from "../../data/siteData";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#080808]/94 shadow-[0_16px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
      <nav className="wd-container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
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
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated && (
            <Link
              to={isAdmin ? "/admin" : "/account"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#F8F7F4] transition hover:border-[#C4A77D]/40 hover:text-[#C4A77D]"
              title={isAdmin ? "Admin dashboard" : "Account"}
            >
              <UserRound size={18} />
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#D9D4CC] transition hover:text-[#C4A77D]"
            >
              Login
            </Link>
          )}

          <Button to="/start" icon={false}>
            Start Your Project
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open mobile menu"
          aria-expanded={isMenuOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[#F8F7F4] transition hover:border-[#C4A77D]/40 hover:text-[#C4A77D] lg:hidden"
        >
          <Menu size={20} />
        </button>
      </nav>

      <NavbarTicker />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}

export default Navbar;
