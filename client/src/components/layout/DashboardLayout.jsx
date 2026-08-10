import { Suspense } from "react";
import { Outlet, useLocation } from "react-router";
import Loader from "../common/Loader";
import PageMeta from "../common/PageMeta";
import VerificationNotice from "../dashboard/VerificationNotice";
import ClientPortalNav from "../portal/ClientPortalNav";
import { clientPortalLinks } from "../portal/portalNavigation";
import "../portal/PortalRecords.css";
import "../portal/Portal.css";
import useLanguage from "../../hooks/useLanguage";

function DashboardLayout() {
  const { t } = useLanguage();
  const location = useLocation();
  const activeMeta =
    clientPortalLinks
      .filter((link) =>
        link.path === "/account"
          ? location.pathname === link.path
          : location.pathname.startsWith(link.path),
      )
      .sort((a, b) => b.path.length - a.path.length)[0] || clientPortalLinks[0];

  return (
    <div className="wd-portal">
      <PageMeta
        title={t(`client.layout.links.${activeMeta.key}`, activeMeta.label)}
        description={t("client.dashboard.description")}
        robots="noindex,nofollow"
      />

      <ClientPortalNav />

      <main id="main-content" tabIndex="-1" className="wd-portal-main">
        <div className="wd-portal-container">
          <VerificationNotice />
          <Suspense
            key={location.pathname}
            fallback={<Loader text={t("common.loading.page")} />}
          >
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
