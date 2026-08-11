import { NavLink, useLocation } from "react-router";
import AdminPageHeader from "./AdminPageHeader";
import ClientManager from "./ClientManager";
import ReviewManager from "./ReviewManager";

const clientTabs = [
  {
    id: "accounts",
    label: "Accounts",
    description: "Client profiles and activity.",
    path: "/admin/clients",
    Component: ClientManager,
  },
  {
    id: "reviews",
    label: "Reviews",
    description: "Approve and add testimonials.",
    path: "/admin/clients/reviews",
    Component: ReviewManager,
  },
];

function ClientControlManager({ initialTab = "accounts" }) {
  const location = useLocation();
  const routeTab =
    clientTabs
      .filter((tab) =>
        tab.id === "accounts"
          ? location.pathname === tab.path
          : location.pathname.startsWith(tab.path)
      )
      .sort((a, b) => b.path.length - a.path.length)[0] ||
    clientTabs.find((tab) => tab.id === initialTab) ||
    clientTabs[0];

  const activeTab = routeTab.id;
  const activeClientTab = routeTab;
  const ActiveComponent = activeClientTab.Component;

  return (
    <div className="wd-admin-page">
      <AdminPageHeader
        eyebrow="Admin dashboard"
        title="Clients"
        description="Manage client accounts, activity, and reviews from one place."
      />

      <nav className="wd-admin-local-tabs" aria-label="Client sections">
          {clientTabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              end={tab.id === "accounts"}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={`wd-admin-local-tab${activeTab === tab.id ? " is-active" : ""}`}
            >
              {tab.label}
              <span className="sr-only"> — {tab.description}</span>
            </NavLink>
          ))}
      </nav>

      <div className="wd-admin-subworkspace">
        <ActiveComponent />
      </div>
    </div>
  );
}

export default ClientControlManager;
