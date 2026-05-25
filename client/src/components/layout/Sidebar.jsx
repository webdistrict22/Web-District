import { NavLink } from "react-router-dom";

function Sidebar({ links = [], title = "", className = "" }) {
  return (
    <aside
      className={`h-fit rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-3 lg:sticky lg:top-24 ${className}`}
    >
      {title && (
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.25em] text-[#D9D4CC]">
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
                    ? "border border-[#C4A77D]/30 bg-[#C4A77D]/14 text-[#F8F7F4]"
                    : "border border-transparent text-[#D9D4CC] hover:bg-white/[0.04] hover:text-[#C4A77D]"
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
