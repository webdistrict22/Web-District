import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#F8F7F4]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default PublicLayout;
