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
const Success = lazy(() => import("../pages/public/Success"));

const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

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
const AdminRequests = lazy(() => import("../components/admin/RequestManager"));
const AdminAppointments = lazy(() =>
  import("../components/admin/AppointmentManager")
);
const AdminContracts = lazy(() => import("../components/admin/ContractManager"));
const AdminClients = lazy(() =>
  import("../components/admin/ClientControlManager")
);
const AdminControl = lazy(() => import("../components/admin/SettingsManager"));

const NotFound = lazy(() => import("../pages/NotFound"));

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Suspense fallback={<Loader page text="Loading" />}>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="work" element={<Work />} />
            <Route path="work/:slug" element={<CaseStudy />} />
            <Route path="process" element={<Process />} />
            <Route path="start" element={<Start />} />
            <Route path="contact" element={<Contact />} />
            <Route path="success" element={<Success />} />
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
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
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
            <Route path="contracts" element={<AdminContracts />} />
            <Route path="clients" element={<AdminClients />} />
            <Route
              path="clients/reviews"
              element={<AdminClients initialTab="reviews" />}
            />
            <Route path="control" element={<AdminControl />} />
            <Route
              path="control/slots"
              element={<AdminControl initialTab="slots" />}
            />
            <Route
              path="control/projects"
              element={<AdminControl initialTab="projects" />}
            />
            <Route
              path="control/faq"
              element={<AdminControl initialTab="faq" />}
            />
            <Route
              path="control/packages"
              element={<AdminControl initialTab="packages" />}
            />
            <Route
              path="slots"
              element={<Navigate to="/admin/control/slots" replace />}
            />
            <Route
              path="projects"
              element={<Navigate to="/admin/control/projects" replace />}
            />
            <Route
              path="faq"
              element={<Navigate to="/admin/control/faq" replace />}
            />
            <Route
              path="packages"
              element={<Navigate to="/admin/control/packages" replace />}
            />
            <Route
              path="settings"
              element={<Navigate to="/admin/control" replace />}
            />
            <Route
              path="reviews"
              element={<Navigate to="/admin/clients/reviews" replace />}
            />
            <Route
              path="messages"
              element={<Navigate to="/admin/clients" replace />}
            />
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
