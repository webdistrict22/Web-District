import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminLayout from "../components/layout/AdminLayout";
import Loader from "../components/common/Loader";
import ScrollToTop from "../components/common/ScrollToTop";

import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import AdminRoute from "./AdminRoute";

const Home = lazy(() => import("../pages/public/Home"));
const Services = lazy(() => import("../pages/public/Services"));
const Work = lazy(() => import("../pages/public/Work"));
const CaseStudy = lazy(() => import("../pages/public/CaseStudy"));
const Process = lazy(() => import("../pages/public/Process"));
const Start = lazy(() => import("../pages/public/Start"));
const Contact = lazy(() => import("../pages/public/Contact"));

const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));

const ClientDashboard = lazy(() => import("../pages/client/ClientDashboard"));
const ClientRequests = lazy(() => import("../pages/client/ClientRequests"));
const ClientAppointments = lazy(() =>
  import("../pages/client/ClientAppointments")
);
const ClientContracts = lazy(() => import("../pages/client/ClientContracts"));
const ClientProjectStatus = lazy(() =>
  import("../pages/client/ClientProjectStatus")
);
const ClientReviews = lazy(() => import("../pages/client/ClientReviews"));
const ClientProfile = lazy(() => import("../pages/client/ClientProfile"));

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminRequests = lazy(() => import("../pages/admin/AdminRequests"));
const AdminAppointments = lazy(() =>
  import("../pages/admin/AdminAppointments")
);
const AdminSlots = lazy(() => import("../pages/admin/AdminSlots"));
const AdminContracts = lazy(() => import("../pages/admin/AdminContracts"));
const AdminProjects = lazy(() => import("../pages/admin/AdminProjects"));
const AdminReviews = lazy(() => import("../pages/admin/AdminReviews"));
const AdminFAQ = lazy(() => import("../pages/admin/AdminFAQ"));
const AdminPackages = lazy(() => import("../pages/admin/AdminPackages"));
const AdminClients = lazy(() => import("../pages/admin/AdminClients"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));
const AdminMessages = lazy(() => import("../pages/admin/AdminMessages"));

const NotFound = lazy(() => import("../pages/NotFound"));

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Suspense fallback={<Loader text="Loading page..." />}>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="work" element={<Work />} />
            <Route path="work/:slug" element={<CaseStudy />} />
            <Route path="process" element={<Process />} />
            <Route path="start" element={<Start />} />
            <Route path="contact" element={<Contact />} />
            <Route
              path="login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="signup"
              element={
                <PublicOnlyRoute>
                  <Signup />
                </PublicOnlyRoute>
              }
            />
          </Route>

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientDashboard />} />
            <Route path="requests" element={<ClientRequests />} />
            <Route path="appointments" element={<ClientAppointments />} />
            <Route path="contracts" element={<ClientContracts />} />
            <Route path="project-status" element={<ClientProjectStatus />} />
            <Route path="reviews" element={<ClientReviews />} />
            <Route path="profile" element={<ClientProfile />} />
          </Route>

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="slots" element={<AdminSlots />} />
            <Route path="contracts" element={<AdminContracts />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="faq" element={<AdminFAQ />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>

          <Route path="/dashboard" element={<Navigate to="/account" replace />} />
          <Route
            path="/admin/dashboard"
            element={<Navigate to="/admin" replace />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
