// pages/worker/Notifications.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { mockNotifications } from "../../services/mockData";
import {
  Bell, CheckCircle, Star, MessageCircle, Shield,
  Clock, Check, X, LogOut, Briefcase, User, Send
} from "lucide-react";

const TYPE_ICONS = {
  job_accepted: <CheckCircle size={18} className="text-green-500" />,
  job_completed:<Star        size={18} className="text-amber-400" />,
  message:      <MessageCircle size={18} className="text-blue-500" />,
  job_sent:     <Send        size={18} className="text-gray-400"  />,
  request:      <Clock       size={18} className="text-amber-500" />,
  approved:     <Shield      size={18} className="text-teal-dark" />,
  expired:      <Clock       size={18} className="text-orange-400"/>,
};

const TYPE_BG = {
  job_accepted: "bg-green-50",
  job_completed:"bg-amber-50",
  message:      "bg-blue-50",
  job_sent:     "bg-gray-50",
  request:      "bg-amber-50",
  approved:     "bg-teal-light",
  expired:      "bg-orange-50",
};

const NAV = [
  { label:"My Jobs",       icon:<Briefcase size={18}/>, to:"/worker/dashboard"      },
  { label:"Profile",       icon:<User      size={18}/>, to:"/worker/profile"        },
  { label:"Notifications", icon:<Bell      size={18}/>, to:"/worker/notifications", active:true },
];

function groupByDate(notifs) {
  const today     = new Date();
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
  const fmt = d => new Date(d).toDateString();
  return {
    TODAY:     notifs.filter(n => fmt(n.createdAt) === fmt(today)),
    YESTERDAY: notifs.filter(n => fmt(n.createdAt) === fmt(yesterday)),
    EARLIER:   notifs.filter(n => fmt(n.createdAt) !== fmt(today) && fmt(n.createdAt) !== fmt(yesterday)),
  };
}

export default function WorkerNotifications() {
  const { logout } = useAuth();
  const [notifs, setNotifs] = useState(mockNotifications);

  useEffect(() => {
    api.get("/worker/notifications")
      .then(d => { if (d?.length) setNotifs(d); })
      .catch(() => {});
  }, []);

  const markAllRead     = () => setNotifs(ns => ns.map(n => ({ ...n, isRead: true })));
  const acceptFromNotif = (id) => setNotifs(ns => ns.map(n => n._id === id ? { ...n, actions: false, message: n.message + " — You accepted this request." } : n));
  const rejectFromNotif = (id) => setNotifs(ns => ns.map(n => n._id === id ? { ...n, actions: false, message: n.message + " — You rejected this request." } : n));

  const unreadCount = notifs.filter(n => !n.isRead).length;
  const grouped     = groupByDate(notifs);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <aside
        className="fixed top-0 left-0 h-full bg-white border-r border-gray-100 shadow-sm flex flex-col z-20"
        style={{ width: 232 }}
      >
        <div className="p-5 mb-2">
          <Link to="/" className="text-xl font-bold text-gray-900 no-underline">
            Work<span className="text-teal-dark">Bridge</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {NAV.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 no-underline
                ${item.active
                  ? "bg-teal-light text-teal-dark"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.active && unreadCount > 0 && (
                <span className="ml-auto bg-teal-dark text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150 w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-8" style={{ marginLeft: 232 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell size={24} className="text-teal-dark" />
            <h1 className="text-2xl font-extrabold text-gray-900 m-0">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-teal-dark text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-900 text-gray-900 text-sm font-semibold hover:bg-gray-900 hover:text-white transition-all duration-150"
          >
            <CheckCircle size={15} />
            Mark All as Read
          </button>
        </div>

        {/* Grouped Notifications */}
        <div className="max-w-2xl flex flex-col gap-6">
          {Object.entries(grouped)
            .filter(([, ns]) => ns.length > 0)
            .map(([group, ns]) => (
              <div key={group}>
                <p className="text-xs font-bold text-gray-400 tracking-widest mb-3">{group}</p>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  {ns.map((n, i) => (
                    <div
                      key={n._id}
                      className={`flex gap-4 items-start p-5 relative transition-all duration-150
                        ${i < ns.length - 1 ? "border-b border-gray-50" : ""}
                        ${!n.isRead ? "bg-teal-light/20" : "bg-white hover:bg-gray-50"}
                      `}
                    >
                      {/* Unread dot */}
                      {!n.isRead && (
                        <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-teal-dark" />
                      )}

                      {/* Icon bubble */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${TYPE_BG[n.type] || "bg-gray-50"}`}>
                        {TYPE_ICONS[n.type] || <Bell size={18} className="text-gray-400" />}
                      </div>

                      {/* Body */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 mb-1">{n.title}</p>
                        <p className="text-sm text-gray-600 leading-relaxed mb-1.5">{n.message}</p>
                        <p className="text-xs text-gray-400 mb-0">
                          {new Date(n.createdAt).toLocaleString("en-PK", {
                            hour: "2-digit", minute: "2-digit",
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </p>

                        {/* Accept / Reject actions */}
                        {n.actions && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => acceptFromNotif(n._id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-all duration-150"
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              onClick={() => rejectFromNotif(n._id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all duration-150"
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        )}

                        {/* Reply link */}
                        {n.hasReply && (
                          <Link
                            to="/employer/chat/j1"
                            className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 border-2 border-gray-900 text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-150 no-underline"
                          >
                            <MessageCircle size={14} /> Reply
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* Empty state */}
          {notifs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Bell size={48} className="text-gray-200 mb-4" />
              <p className="text-lg font-bold text-gray-800 mb-2">No notifications yet</p>
              <p className="text-sm text-gray-400">You're all caught up!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}