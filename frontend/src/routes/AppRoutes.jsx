import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Home             from "../pages/Home";
import Login            from "../pages/auth/Login";
import WorkerRegister   from "../pages/auth/WorkerRegister";
import EmployerRegister from "../pages/auth/EmployerRegister";
import WorkerDashboard  from "../pages/worker/Dashboard";
import WorkerProfile    from "../pages/worker/Profile";
import WorkerNotifications from "../pages/worker/Notifications";
import FindWorkers      from "../pages/employer/FindWorkers";
import WorkerPublicProfile from "../pages/employer/WorkerPublicProfile";
import SendJobRequest   from "../pages/employer/SendJobRequest";
import JobRequests      from "../pages/employer/JobRequests";
import Chat             from "../pages/employer/Chat";
import EmployerNotifications from "../pages/employer/Notifications";
import AdminDashboard   from "../pages/admin/Dashboard";

function getDashboard(role) {
  if (role === "worker")   return "/worker/dashboard";
  if (role === "employer") return "/employer/workers";
  if (role === "admin")    return "/admin/dashboard";
  return "/";
}

function HomeRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to={getDashboard(user.role)} replace />;
  return <Home />;
}

function GuestRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to={getDashboard(user.role)} replace />;
  return children;
}

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={getDashboard(user.role)} replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                          element={<HomeRoute />} />
      <Route path="/login"                     element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register/worker"           element={<GuestRoute><WorkerRegister /></GuestRoute>} />
      <Route path="/register/employer"         element={<GuestRoute><EmployerRegister /></GuestRoute>} />
      <Route path="/worker/dashboard"          element={<PrivateRoute role="worker"><WorkerDashboard /></PrivateRoute>} />
      <Route path="/worker/profile"            element={<PrivateRoute role="worker"><WorkerProfile /></PrivateRoute>} />
      <Route path="/worker/notifications"      element={<PrivateRoute role="worker"><WorkerNotifications /></PrivateRoute>} />
      <Route path="/employer/workers"          element={<FindWorkers />} />
      <Route path="/employer/workers/:id"      element={<WorkerPublicProfile />} />
      <Route path="/employer/hire/:workerId"   element={<PrivateRoute role="employer"><SendJobRequest /></PrivateRoute>} />
      <Route path="/employer/jobs"             element={<PrivateRoute role="employer"><JobRequests /></PrivateRoute>} />
      <Route path="/employer/chat"             element={<PrivateRoute role="employer"><Chat /></PrivateRoute>} />
      <Route path="/employer/chat/:jobId"      element={<PrivateRoute role="employer"><Chat /></PrivateRoute>} />
      <Route path="/employer/notifications"    element={<PrivateRoute role="employer"><EmployerNotifications /></PrivateRoute>} />
      <Route path="/admin/dashboard"           element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
      <Route path="*"                          element={<Navigate to="/" replace />} />
    </Routes>
  );
}
