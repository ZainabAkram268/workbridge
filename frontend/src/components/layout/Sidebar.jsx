import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Briefcase, User, Bell, LayoutDashboard,
  ShieldCheck, BarChart3, LogOut, MessageSquare,
  PlusCircle, Users, LayoutGrid
} from "lucide-react";

const ROLE_CONFIG = {
  worker: {
    links: [
      { label: "My Jobs", Icon: Briefcase, to: "/worker/dashboard" },
      { label: "Chat", Icon: MessageSquare, to: "/worker/chat" },
      { label: "Profile", Icon: User, to: "/worker/profile" },
      { label: "Notifications", Icon: Bell, to: "/worker/notifications", badge: 3 },
    ],
    label: "Worker Portal",
    accent: "#14b8a6", // teal
  },
  employer: {
    links: [
      { label: "Dashboard", Icon: LayoutDashboard, to: "/employer/dashboard" },
      { label: "Post a Job", Icon: PlusCircle, to: "/employer/post-job" },
      { label: "Jobs", Icon: Briefcase, to: "/employer/jobs" },
      { label: "Chat", Icon: MessageSquare, to: "/employer/chat", badge: 2 },
      { label: "Notifications", Icon: Bell, to: "/employer/notifications", badge: 2 },
    ],
    label: "Employer Portal",
    accent: "#10b981", // emerald
  },
  admin: {
    links: [
      { label: "Overview", Icon: LayoutGrid, to: "/admin/dashboard" },
      { label: "Verify Workers", Icon: ShieldCheck, to: "/admin/verify" },
      { label: "All Workers", Icon: Users, to: "/admin/workers" },
      { label: "Job Stats", Icon: BarChart3, to: "/admin/stats" },
    ],
    label: "Admin Panel",
    accent: "#f59e0b", // amber
  },
};

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export default function Sidebar({ role = "worker" }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const config = ROLE_CONFIG[role] || ROLE_CONFIG.worker;
  const { links, label, accent } = config;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-[240px] shrink-0 h-full bg-[#0F172A] text-slate-400 flex flex-col shadow-2xl overflow-y-auto border-r border-slate-800">
      {/* Header */}
      <div className="px-6 py-8">
        <Link to="/" className="flex flex-col no-underline group">
          <span className="text-xl font-black text-white tracking-tight flex items-center gap-1">
            Work<span className="text-teal-400 group-hover:text-teal-300 transition-colors">Bridge</span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
            {label}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ label, Icon, to, badge }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={label}
              to={to}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline
                ${active
                  ? "bg-slate-800 text-white shadow-lg shadow-black/20"
                  : "hover:bg-slate-800/40 hover:text-slate-200"
                }`}
            >
              <Icon
                size={18}
                className={`transition-colors duration-200 ${active ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"}`}
                style={active ? { color: accent } : undefined}
              />
              <span className="flex-1 tracking-wide">{label}</span>
              
              {badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                  {badge}
                </span>
              )}
              {active && (
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-slate-800/50 mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-900/50">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
            style={{ backgroundColor: `${accent}20`, color: accent }}
          >
            {getInitials(user?.fullName || user?.name)}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-200 truncate">
              {user?.fullName || user?.name || "User"}
            </div>
            <div className="text-xs text-slate-500 capitalize">{role}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-bold tracking-wide uppercase text-[11px]">Logout</span>
        </button>
      </div>
    </aside>
  );
}