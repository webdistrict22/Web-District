import { NavLink, useLocation } from "react-router";
import AdminPageHeader from "./AdminPageHeader";
import SlotManager from "./SlotManager";
import FAQManager from "./FAQManager";
import PackageManager from "./PackageManager";
import ProjectManager from "./ProjectManager";

const controlTabs = [
  {
    id: "slots",
    label: "Slots",
    description: "Manage call availability.",
    path: "/admin/control/slots",
    Component: SlotManager,
  },
  {
    id: "faq",
    label: "FAQ",
    description: "Manage public questions.",
    path: "/admin/control/faq",
    Component: FAQManager,
  },
  {
    id: "packages",
    label: "Packages",
    description: "Manage service packages.",
    path: "/admin/control/packages",
    Component: PackageManager,
  },
  {
    id: "projects",
    label: "Projects",
    description: "Manage selected work.",
    path: "/admin/control/projects",
    Component: ProjectManager,
  },
];

function ControlManager({ initialTab = "slots" }) {
  const location = useLocation();
  const routeTab =
    controlTabs
      .filter((tab) => location.pathname.startsWith(tab.path))
      .sort((a, b) => b.path.length - a.path.length)[0] ||
    controlTabs.find((tab) => tab.id === initialTab) ||
    controlTabs[0];

  const activeTab = routeTab.id;
  const activeControl = routeTab;
  const ActiveComponent = activeControl.Component;

  return (
    <div className="wd-admin-page">
      <AdminPageHeader
        eyebrow="Admin dashboard"
        title="Control"
        description="Manage the parts that change often: slots, FAQ, packages, and selected work."
      />

      <nav className="wd-admin-local-tabs" aria-label="Control sections">
          {controlTabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
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

export default ControlManager;
