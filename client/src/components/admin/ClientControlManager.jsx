import { useState } from "react";
import Card from "../common/Card";
import ClientManager from "./ClientManager";
import ReviewManager from "./ReviewManager";

const clientTabs = [
  {
    id: "accounts",
    label: "Accounts",
    description: "Client profiles and activity.",
    Component: ClientManager,
  },
  {
    id: "reviews",
    label: "Reviews",
    description: "Approve and add testimonials.",
    Component: ReviewManager,
  },
];

function ClientControlManager({ initialTab = "accounts" }) {
  const [activeTab, setActiveTab] = useState(() =>
    clientTabs.some((tab) => tab.id === initialTab)
      ? initialTab
      : clientTabs[0].id
  );

  const activeClientTab =
    clientTabs.find((tab) => tab.id === activeTab) || clientTabs[0];
  const ActiveComponent = activeClientTab.Component;

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
          Admin dashboard
        </p>

        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          Clients
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-[#D9D4CC]">
          Manage client accounts and reviews from one place.
        </p>
      </Card>

      <Card className="p-3">
        <div
          className="grid gap-2 md:grid-cols-2"
          role="group"
          aria-label="Client sections"
        >
          {clientTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
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

      <div>
        <ActiveComponent />
      </div>
    </div>
  );
}

export default ClientControlManager;
