import { Link, NavLink, Outlet } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  Home,
  Layers,
  LogOut,
  UsersRound,
} from "lucide-react";
import Container from "../common/Container";
import useAuth from "../../hooks/useAuth";

const adminLinks = [
  { label: "Overview", path: "/admin", icon: Home },
  { label: "Requests", path: "/admin/requests", icon: FileText },
  { label: "Appointments", path: "/admin/appointments", icon: CalendarDays },
  { label: "Contracts", path: "/admin/contracts", icon: FileText },
  { label: "Clients", path: "/admin/clients", icon: UsersRound },
  { label: "Control", path: "/admin/control", icon: Layers },
];

function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#080808] pb-20 pt-10 md:pt-14">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit max-h-[calc(100vh-80px)] overflow-y-auto rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-3 lg:sticky lg:top-8">
            <nav className="grid gap-2">
              {adminLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === "/admin"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "border border-[#C4A77D]/30 bg-[#C4A77D]/14 text-[#F8F7F4]"
                          : "border border-transparent text-[#D9D4CC] hover:bg-white/[0.04] hover:text-[#C4A77D]"
                      }`
                    }
                  >
                    <Icon size={17} />
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-4 rounded-[1.35rem] border border-[#C4A77D]/22 bg-[linear-gradient(135deg,rgba(196,167,125,0.12),rgba(100,19,26,0.10))] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C4A77D]">
                Admin dashboard
              </p>

              <h1 className="font-display mt-2 text-2xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
                Web District Control Center
              </h1>

              <p className="mt-2 break-words text-sm text-[#D9D4CC]">
                {user?.email}
              </p>

              <div className="mt-4 grid gap-2">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C4A77D]/30 bg-[#C4A77D]/10 px-4 py-3 text-sm font-semibold text-[#F8F7F4] transition hover:border-[#C4A77D]/50 hover:text-[#C4A77D]"
                >
                  <Home size={17} />
                  Go home
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-[#F8F7F4] transition hover:border-[#C4A77D]/45 hover:text-[#C4A77D]"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          <section>
            <Outlet />
          </section>
        </div>
      </Container>
    </main>
  );
}

export default AdminLayout;
