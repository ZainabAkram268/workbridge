<<<<<<< Updated upstream
=======
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutGrid,
  Users,
  Briefcase,
  MessageCircle,
  Bell,
  UserCircle,
  ShieldCheck,
  BarChart2,
  LogOut,
} from "lucide-react";

function initials(name = "") {
  return name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

const EMPLOYER_LINKS = [
  { label: "Dashboard",      icon: LayoutGrid,    to: "/employer/workers" },
  
  { label: "Jobs",        icon: Briefcase,     to: "/employer/jobs",          badge: 5 },
  { label: "Messages",       icon: MessageCircle, to: "/employer/chat",          badge: 2 },
  { label: "Notifications",  icon: Bell,          to: "/employer/notifications", badge: 2 },
];

const WORKER_LINKS = [
  { label: "My Jobs",        icon: Briefcase,     to: "/worker/dashboard" },
  { label: "Profile",        icon: UserCircle,    to: "/worker/profile" },
  { label: "Notifications",  icon: Bell,          to: "/worker/notifications", badge: 3 },
];

const ADMIN_LINKS = [
  { label: "Overview",       icon: LayoutGrid,    to: "/admin/dashboard" },
  { label: "Verify Workers", icon: ShieldCheck,   to: "/admin/verify" },
  { label: "Job Stats",      icon: BarChart2,     to: "/admin/stats" },
];

const ROLE_CONFIG = {
  employer: { links: EMPLOYER_LINKS, label: "Employer Portal", accent: "#10b981", accentDim: "#064e3b" },
  worker:   { links: WORKER_LINKS,   label: "Worker Portal",   accent: "#3b82f6", accentDim: "#1e3a5f" },
  admin:    { links: ADMIN_LINKS,    label: "Admin Panel",     accent: "#f59e0b", accentDim: "#78350f" },
};

export default function Sidebar({ role = "worker" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { links, label, accent, accentDim } = ROLE_CONFIG[role] || ROLE_CONFIG.worker;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      style={{
        width: "232px",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        background: "#0f1117",
        borderRight: "1px solid #1e2130",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: "20px 18px 18px",
          borderBottom: "1px solid #1e2130",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: 1000,
            color: "#ffffff",
            letterSpacing: "-0.4px",
          }}
        >
          Work<span style={{fontSize:"20px", color:"#2a9d8f" }}>Bridge</span>
        </div>
        <div
          style={{
            fontSize: "9px",
            color: "#3d4460",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            marginTop: "3px",
          }}
        >
          {label}
        </div>
      </div>

      {/* ── Section label ── */}
      <div
        style={{
          padding: "0 18px 4px",
          fontSize: "9px",
          fontWeight: 700,
          color: "#2e3450",
          textTransform: "uppercase",
          letterSpacing: "1.2px",
        }}
      >
        Main
      </div>

      {/* ── Nav links ── */}
      <nav style={{ padding: "0 10px", flex: 1 }}>
        {links.map(({ label: lbl, icon: Icon, to, badge }) => (
          <NavLink
            key={lbl}
            to={to}
            end
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 10px",
              borderRadius: "8px",
              marginBottom: "2px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 500,
              transition: "all 0.15s",
              color: isActive ? "#ffffff" : "#7b82a0",
              background: isActive ? "#1e2130" : "transparent",
              border: isActive ? "1px solid #2a2f45" : "1px solid transparent",
            })}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  style={{ color: isActive ? accent : "#4b5280", flexShrink: 0 }}
                />
                <span style={{ flex: 1 }}>{lbl}</span>
                {badge && (
                  <span
                    style={{
                      background: accent,
                      color: "#ffffff",
                      fontSize: "9px",
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: "20px",
                      minWidth: "18px",
                      textAlign: "center",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom: user chip + logout ── */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid #1e2130" }}>
        {/* User chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "8px",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: accentDim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accent,
              fontSize: "11px",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {initials(user?.fullName || user?.name || "U")}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#c8d0e8",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.fullName || user?.name || "User"}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#4b5280",
                textTransform: "capitalize",
              }}
            >
              {role}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1a1f2e";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#4b5280";
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            padding: "8px 10px",
            borderRadius: "8px",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            color: "#4b5280",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "inherit",
            transition: "all 0.15s",
          }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
>>>>>>> Stashed changes
