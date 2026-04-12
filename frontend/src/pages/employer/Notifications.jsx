<<<<<<< Updated upstream
=======
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";

import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  AlertTriangle,
} from "lucide-react";

const MOCK = [
  {
    id: 1,
    type: "accepted",
    icon: <Check size={16} />,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    title: "Job Accepted",
    body: "Ali Mahmood has accepted your Driver request.",
    time: "14 Jun 2025",
    read: false,
  },
  {
    id: 2,
    type: "rejected",
    icon: <XCircle size={16} />,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
    title: "Job Rejected",
    body: "Mohammad Khan rejected your request.",
    time: "14 Jun 2025",
    read: false,
  },
  {
    id: 3,
    type: "done",
    icon: <CheckCircle size={16} />,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    title: "Job Marked Done",
    body: "Worker marked job as completed. Please confirm.",
    time: "13 Jun 2025",
    read: true,
  },
  {
    id: 4,
    type: "expired",
    icon: <Clock size={16} />,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    title: "Job Expired",
    body: "Your request expired after 24 hours.",
    time: "9 Jun 2025",
    read: true,
  },
];

function groupNotifications(notifs) {
  return {
    TODAY:     notifs.filter(n => n.time.includes("14 Jun")),
    YESTERDAY: notifs.filter(n => n.time.includes("13 Jun")),
    EARLIER:   notifs.filter(n => !n.time.includes("14 Jun") && !n.time.includes("13 Jun")),
  };
}

export default function EmployerNotifications() {
  const [notifs, setNotifs] = useState(MOCK);

  useEffect(() => {
    api.get("/employer/notifications")
      .then(d => { if (d?.length) setNotifs(d); })
      .catch(() => {});
  }, []);

  const markAllRead = () =>
    setNotifs(ns => ns.map(n => ({ ...n, read: true })));

  const markOneRead = (id) =>
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifs.filter(n => !n.read).length;
  const grouped = groupNotifications(notifs);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="employer" />

      <main className="flex-1 ml-[232px] p-8">
        <div className="max-w-2xl">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <Bell size={20} className="text-teal-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-none">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-xs text-teal-600 font-semibold mt-0.5">{unreadCount} unread</p>
                )}
              </div>
            </div>

            <button
              onClick={markAllRead}
              className="text-sm font-medium text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Mark all read
            </button>
          </div>

          {/* Groups */}
          {Object.entries(grouped)
            .filter(([, list]) => list.length > 0)
            .map(([group, list]) => (
              <div key={group} className="mb-6">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {group}
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 shadow-sm overflow-hidden">
                  {list.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markOneRead(n.id)}
                      className={`flex gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                        !n.read ? "bg-teal-50/50" : ""
                      }`}
                    >
                      {/* Unread dot */}
                      {!n.read && (
                        <span className="absolute top-4 right-4 w-2 h-2 bg-teal-500 rounded-full" />
                      )}

                      {/* Icon */}
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${n.bgColor} ${n.iconColor}`}>
                        {n.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm mb-0.5 ${!n.read ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                          {n.title}
                        </div>
                        <div className="text-sm text-gray-500 leading-snug">
                          {n.body}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{n.time}</div>

                        {n.type === "done" && (
                          <button className="mt-3 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                            Confirm Done
                          </button>
                        )}

                        {n.type === "expired" && (
                          <Link
                            to="/employer/workers"
                            className="mt-3 inline-block text-xs text-teal-600 font-semibold hover:underline"
                          >
                            Find new worker →
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
            <div className="text-center py-24 text-gray-400">
              <Bell size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No notifications yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
>>>>>>> Stashed changes
