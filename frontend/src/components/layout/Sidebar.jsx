import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Briefcase, User, Bell, LayoutDashboard,
  ShieldCheck, BarChart3, LogOut, MessageSquare,
  PlusCircle, Users
} from "lucide-react";

const WORKER_LINKS = [
  { label: "My Jobs",       Icon: Briefcase,      to: "/worker/dashboard" },
  { label: "Chat",          Icon: MessageSquare,  to: "/worker/chat" },
  { label: "Profile",       Icon: User,           to: "/worker/profile" },
  { label: "Notifications", Icon: Bell,           to: "/worker/notifications" },
];

const EMPLOYER_LINKS = [
  { label: "Dashboard",     Icon: LayoutDashboard, to: "/employer/dashboard" },
  { label: "Post a Job",    Icon: PlusCircle,      to: "/employer/post-job" },
  { label: "Chat",          Icon: MessageSquare,   to: "/employer/chat" },
  { label: "Profile",       Icon: User,            to: "/employer/profile" },
];

const ADMIN_LINKS = [
  { label: "Overview",       Icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Verify Workers", Icon: ShieldCheck,     to: "/admin/verify" },
  { label: "All Workers",    Icon: Users,           to: "/admin/workers" },
  { label: "Job Stats",      Icon: BarChart3,       to: "/admin/stats" },
];

export default function Sidebar({ role = "worker" }) {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const links = role === "admin" ? ADMIN_LINKS : role === "employer" ? EMPLOYER_LINKS : WORKER_LINKS;

  return (
    // KEY FIX: No more fixed/absolute. It's a normal flex child.
    // h-full fills the row below navbar. overflow-y-auto handles long nav lists.
    <aside className="w-[240px] shrink-0 h-full bg-[#0F172A] text-slate-400 flex flex-col shadow-2xl overflow-y-auto">
      
      {/* Header */}
      <div className="px-6 py-8">
        <Link to="/" className="flex flex-col no-underline group">
          <span className="text-xl font-black text-white tracking-tight flex items-center gap-1">
            Work<span className="text-teal-400 group-hover:text-teal-300 transition-colors">Bridge</span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
            {role === "admin" ? "Admin Panel" : "Platform"}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ label, Icon, to }) => {
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
              />
              <span className="flex-1 tracking-wide">{label}</span>
              {active && (
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800/30">
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-bold tracking-wide uppercase text-[11px]">Logout</span>
        </button>
      </div>
    </aside>
  );
}