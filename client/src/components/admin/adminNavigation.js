export const adminLinks = [
  { label: "Overview", path: "/admin" },
  { label: "Requests", path: "/admin/requests" },
  { label: "Appointments", path: "/admin/appointments" },
  { label: "Contracts", path: "/admin/contracts" },
  { label: "Clients", path: "/admin/clients" },
  { label: "Control", path: "/admin/control" },
];

export const isAdminRouteActive = (pathname, path) => {
  if (path === "/admin") return pathname === path;
  if (path === "/admin/clients") return pathname.startsWith("/admin/clients");
  if (path === "/admin/control") return pathname.startsWith("/admin/control");
  return pathname === path;
};
