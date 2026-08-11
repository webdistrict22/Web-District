import { Suspense } from "react";
import { Outlet, useLocation } from "react-router";
import Loader from "../common/Loader";
import PageMeta from "../common/PageMeta";
import AdminNav from "../admin/AdminNav";
import "../admin/Admin.css";

function AdminLayout() {
  const location = useLocation();

  return (
    <div className="wd-admin">
      <PageMeta title="Admin" robots="noindex,nofollow" />
      <AdminNav />

      <main id="main-content" tabIndex="-1" className="wd-admin-main">
        <div className="wd-admin-container">
          <section aria-label="Admin workspace">
            <Suspense
              key={location.pathname}
              fallback={
                <div className="wd-admin-route-loading">
                  <Loader text="Loading admin view..." />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
