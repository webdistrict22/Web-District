import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminLayout from "../components/layout/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import Work from "../pages/public/Work";
import CaseStudy from "../pages/public/CaseStudy";
import Process from "../pages/public/Process";
import Start from "../pages/public/Start";
import Contact from "../pages/public/Contact";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import ClientDashboard from "../pages/client/ClientDashboard";
import ClientRequests from "../pages/client/ClientRequests";
import ClientAppointments from "../pages/client/ClientAppointments";
import ClientContracts from "../pages/client/ClientContracts";
import ClientProjectStatus from "../pages/client/ClientProjectStatus";
import ClientReviews from "../pages/client/ClientReviews";
import ClientProfile from "../pages/client/ClientProfile";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminRequests from "../pages/admin/AdminRequests";
import AdminAppointments from "../pages/admin/AdminAppointments";
import AdminSlots from "../pages/admin/AdminSlots";
import AdminContracts from "../pages/admin/AdminContracts";
import AdminProjects from "../pages/admin/AdminProjects";
import AdminReviews from "../pages/admin/AdminReviews";
import AdminFAQ from "../pages/admin/AdminFAQ";
import AdminPackages from "../pages/admin/AdminPackages";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminClients from "../pages/admin/AdminClients";
import AdminMessages from "../pages/admin/AdminMessages";

import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "work", element: <Work /> },
      { path: "work/:slug", element: <CaseStudy /> },
      { path: "process", element: <Process /> },
      { path: "start", element: <Start /> },
      { path: "contact", element: <Contact /> },
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/account",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <ClientDashboard /> },
          { path: "requests", element: <ClientRequests /> },
          { path: "appointments", element: <ClientAppointments /> },
          { path: "contracts", element: <ClientContracts /> },
          { path: "project-status", element: <ClientProjectStatus /> },
          { path: "reviews", element: <ClientReviews /> },
          { path: "profile", element: <ClientProfile /> },
        ],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "requests", element: <AdminRequests /> },
          { path: "appointments", element: <AdminAppointments /> },
          { path: "slots", element: <AdminSlots /> },
          { path: "contracts", element: <AdminContracts /> },
          { path: "projects", element: <AdminProjects /> },
          { path: "reviews", element: <AdminReviews /> },
          { path: "faq", element: <AdminFAQ /> },
          { path: "packages", element: <AdminPackages /> },
          { path: "settings", element: <AdminSettings /> },
          { path: "clients", element: <AdminClients /> },
          { path: "messages", element: <AdminMessages /> },
        ],
      },
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;