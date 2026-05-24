import { NavLink, Outlet } from "react-router-dom";
import {
  CalendarDays,
  FileQuestion,
  FileText,
  FolderKanban,
  Home,
  Layers,
  LogOut,
  MessageSquare,
  Settings,
  Star,
  UsersRound,
} from "lucide-react";
import Container from "../common/Container";
import useAuth from "../../hooks/useAuth";

const adminLinks = [
  { label: "Overview", path: "/admin", icon: Home },
  { label: "Requests", path: "/admin/requests", icon: FileText },
  { label: "Appointments", path: "/admin/appointments", icon: CalendarDays },
  { label: "Slots", path: "/admin/slots", icon: Layers },
  { label: "Contracts", path: "/admin/contracts", icon: FileText },
  { label: "Projects", path: "/admin/projects", icon: FolderKanban },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "FAQ", path: "/admin/faq", icon: FileQuestion },
  { label: "Packages", path: "/admin/packages", icon: Layers },
  { label: "Clients", path: "/admin/clients", icon: UsersRound },
  { label: "Settings", path: "/admin/settings", icon: Settings },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
];

function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#020817] pb-20 pt-28">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-5 rounded-[1.6rem] border border-[#C69A4E]/20 bg-[#C69A4E]/8 p-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-[#F1D08B]">Admin dashboard</p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-[-0.05em]">
              Web District Control Center
            </h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Logged in as {user?.email}
            </p>
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

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit max-h-[calc(100vh-120px)] overflow-y-auto rounded-[1.6rem] border border-white/10 bg-[#0A1A2D]/70 p-3 lg:sticky lg:top-24">
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

export default AdminLayout;