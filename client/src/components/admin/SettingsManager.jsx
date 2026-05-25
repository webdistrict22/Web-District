import { useState } from "react";
import Card from "../common/Card";
import SlotManager from "./SlotManager";
import FAQManager from "./FAQManager";
import PackageManager from "./PackageManager";
import ProjectManager from "./ProjectManager";

const controlTabs = [
  {
    id: "slots",
    label: "Slots",
    description: "Manage call availability.",
    Component: SlotManager,
  },
  {
    id: "faq",
    label: "FAQ",
    description: "Manage public questions.",
    Component: FAQManager,
  },
  {
    id: "packages",
    label: "Packages",
    description: "Manage service packages.",
    Component: PackageManager,
  },
  {
    id: "projects",
    label: "Projects",
    description: "Manage selected work.",
    Component: ProjectManager,
  },
];

function ControlManager({ initialTab = "slots" }) {
  const [activeTab, setActiveTab] = useState(() =>
    controlTabs.some((tab) => tab.id === initialTab)
      ? initialTab
      : controlTabs[0].id
  );

  const activeControl =
    controlTabs.find((tab) => tab.id === activeTab) || controlTabs[0];
  const ActiveComponent = activeControl.Component;

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
          Admin dashboard
        </p>

        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          Control
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-[#D9D4CC]">
          Manage the parts that change often: slots, FAQ, packages, and
          selected work.
        </p>
      </Card>

      <Card className="p-3">
        <div className="grid gap-2 md:grid-cols-4">
          {controlTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                activeTab === tab.id
                  ? "border-[#C4A77D]/45 bg-[#C4A77D]/12 text-[#F8F7F4]"
                  : "border-white/10 bg-white/[0.025] text-[#D9D4CC] hover:border-[#C4A77D]/35 hover:text-[#F8F7F4]"
              }`}
            >
              <span className="block text-sm font-semibold">{tab.label}</span>
              <span className="mt-1 block text-xs text-[#D9D4CC]">
                {tab.description}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <ActiveComponent />
    </div>
  );
}

export default ControlManager;
