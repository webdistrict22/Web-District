import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#020817] text-[#F5F8FC]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default PublicLayout;