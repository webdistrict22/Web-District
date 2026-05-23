import { NavLink, Outlet } from "react-router-dom";
import { CalendarDays, FileText, Home, LogOut, MessageSquare, UserRound } from "lucide-react";
import Container from "../common/Container";
import useAuth from "../../hooks/useAuth";

const clientLinks = [
  { label: "Overview", path: "/account", icon: Home },
  { label: "Requests", path: "/account/requests", icon: FileText },
  { label: "Appointments", path: "/account/appointments", icon: CalendarDays },
  { label: "Contracts", path: "/account/contracts", icon: FileText },
  { label: "Reviews", path: "/account/reviews", icon: MessageSquare },
  { label: "Profile", path: "/account/profile", icon: UserRound },
];

function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#020817] pb-20 pt-28">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-5 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-[#94A3B8]">Client portal</p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-[-0.05em]">
              Welcome, {user?.name}
            </h1>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-[#F5F8FC] transition hover:border-red-400/40 hover:text-red-300"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-[1.6rem] border border-white/10 bg-[#0A1A2D]/70 p-3">
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
                          ? "bg-[#C69A4E]/15 text-[#F1D08B]"
                          : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-white"
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