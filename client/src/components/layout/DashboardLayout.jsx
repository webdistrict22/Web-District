import { Link, NavLink, Outlet } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Container from "../common/Container";
import useAuth from "../../hooks/useAuth";

const clientLinks = [
  { label: "Overview", path: "/account", icon: Home },
  { label: "Requests", path: "/account/requests", icon: FileText },
  { label: "Appointments", path: "/account/appointments", icon: CalendarDays },
  { label: "Contracts", path: "/account/contracts", icon: FileText },
  { label: "Project Status", path: "/account/project-status", icon: TrendingUp },
  { label: "Reviews", path: "/account/reviews", icon: MessageSquare },
  { label: "Profile", path: "/account/profile", icon: UserRound },
];

function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#080808] pb-20 pt-28">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-5 rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-[#D9D4CC]">Client portal</p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-[-0.05em]">
              Welcome, {user?.name}
            </h1>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
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

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-3 lg:sticky lg:top-24">
            <nav className="grid gap-2">
              {clientLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === "/account"}
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
          </aside>

          <section>
            <Outlet />
          </section>
        </div>
      </Container>
    </main>
  );
}

export default DashboardLayout;
