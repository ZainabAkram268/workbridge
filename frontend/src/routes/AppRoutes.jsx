import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Layout Components
import DashboardLayout from "../components/layout/DashboardLayout";
import PageWrapper from "../components/layout/PageWrapper";

// Page Imports
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import WorkerRegister from "../pages/auth/WorkerRegister";
import EmployerRegister from "../pages/auth/EmployerRegister";
import WorkerDashboard from "../pages/worker/Dashboard";
import WorkerProfile from "../pages/worker/Profile";
import WorkerNotifications from "../pages/worker/Notifications";
import FindWorkers from "../pages/employer/FindWorkers";
import WorkerPublicProfile from "../pages/employer/WorkerPublicProfile";
import SendJobRequest from "../pages/employer/SendJobRequest";
import JobRequests from "../pages/employer/JobRequests";
import Chat from "../pages/employer/Chat";
import EmployerNotifications from "../pages/employer/Notifications";
import AdminDashboard from "../pages/admin/Dashboard";

// --- PRIVATE ROUTE COMPONENT ---
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// --- HELPERS ---
function getDashboard(role) {
  if (role === "worker") return "/worker/dashboard";
  if (role === "employer") return "/employer/workers";
  if (role === "admin") return "/admin/dashboard";
  return "/";
}

const withWrapper = (Component, props = {}) => (
  <PageWrapper {...props}>
    <Component />
  </PageWrapper>
);

// --- MAIN ROUTES ---
export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={user ? <Navigate to={getDashboard(user.role)} replace /> : <Home />} />
      <Route path="/login" element={user ? <Navigate to={getDashboard(user.role)} replace /> : <Login />} />
      <Route path="/register/worker" element={<WorkerRegister />} />
      <Route path="/register/employer" element={<EmployerRegister />} />

      {/* --- WORKER ROUTES --- */}
      <Route element={<PrivateRoute role="worker"><DashboardLayout role="worker" /></PrivateRoute>}>
        <Route path="/worker/dashboard" element={withWrapper(WorkerDashboard)} />
        <Route path="/worker/profile" element={withWrapper(WorkerProfile, { maxWidth: 1000 })} />
        <Route path="/worker/notifications" element={withWrapper(WorkerNotifications)} />
        {/* In AppRoutes.jsx */}
        <Route 
          path="/worker/chat/:jobId" 
          element={withWrapper(Chat, { fluid: true })} 
        />
      </Route>

      {/* --- EMPLOYER ROUTES --- */}
      <Route element={<PrivateRoute role="employer"><DashboardLayout role="employer" /></PrivateRoute>}>
        <Route path="/employer/workers" element={withWrapper(FindWorkers)} />
        <Route path="/employer/workers/:id" element={withWrapper(WorkerPublicProfile)} />
        <Route path="/employer/hire/:workerId" element={withWrapper(SendJobRequest)} />
        <Route path="/employer/jobs" element={withWrapper(JobRequests)} />
        {/* For Employers */}
        <Route 
          path="/employer/chat/:jobId?" 
         element={withWrapper(Chat, { fluid: true })} 
        />
        <Route path="/employer/notifications" element={withWrapper(EmployerNotifications)} />
      </Route>

      {/* --- ADMIN ROUTES --- */}
      <Route element={<PrivateRoute role="admin"><DashboardLayout role="admin" /></PrivateRoute>}>
        <Route path="/admin/dashboard" element={withWrapper(AdminDashboard)} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}