import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Loader from "../common/Loader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useLanguage from "../../hooks/useLanguage";

function PublicLayout() {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#080808] text-[#F8F7F4]">
      <Navbar />
      <div id="main-content" tabIndex="-1" className="scroll-mt-28">
        <Suspense
          key={location.pathname}
          fallback={
            <div className="min-h-[65vh] pt-32">
              <Loader text={t("common.loading.page")} />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

export default PublicLayout;
