import { NavLink } from "react-router-dom";

function Sidebar({ links = [], title = "", className = "" }) {
  return (
    <aside
      className={`h-fit rounded-[1.6rem] border border-white/10 bg-[#0A1A2D]/70 p-3 lg:sticky lg:top-24 ${className}`}
    >
      {title && (
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.25em] text-[#64748B]">
          {title}
        </p>
      )}

      <nav className="grid gap-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#C69A4E]/15 text-[#F1D08B]"
                    : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              {Icon && <Icon size={17} />}
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;