import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LanguageToggle from "./LanguageToggle";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#F8F7F4]">
      <Navbar />
      <main id="main-content" tabIndex="-1" className="scroll-mt-28">
        <Outlet />
      </main>
      <Footer />
      <LanguageToggle />
    </div>
  );
}

export default PublicLayout;
