import { Link, NavLink } from "react-router-dom";
import { Menu, UserRound } from "lucide-react";
import Button from "../common/Button";
import { navLinks } from "../../data/siteData";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#020817]/78 backdrop-blur-2xl">
      <nav className="wd-container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C69A4E]/25 bg-[#0A1A2D]">
            <span className="font-display text-sm font-black tracking-[-0.08em] text-[#F5F8FC]">
              WD
            </span>
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#22D3EE]" />
          </div>

          <div>
            <p className="font-display text-lg font-bold tracking-[-0.04em] text-white">
              Web District
            </p>
            <p className="text-xs text-[#94A3B8]">Premium Web Studio</p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? "text-[#F5F8FC]" : "text-[#94A3B8] hover:text-[#F5F8FC]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated && (
            <Link
              to={isAdmin ? "/admin" : "/account"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#F5F8FC] transition hover:border-[#C69A4E]/40"
              title={isAdmin ? "Admin dashboard" : "Account"}
            >
              <UserRound size={18} />
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#94A3B8] transition hover:text-white"
            >
              Login
            </Link>
          )}

          <Button to="/start" icon={false}>
            Book your website
          </Button>
        </div>

        <button className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] lg:hidden">
          <Menu size={20} />
        </button>
      </nav>
    </header>
  );
}

export default Navbar;