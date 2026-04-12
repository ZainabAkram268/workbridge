import React from "react";
import { CheckCircle, XCircle, Clock, MessageCircle, Shield, AlarmClock, Star, Bell, Check, X } from "lucide-react";

const TYPE_STYLE = {
  request:  { bg: "bg-yellow-100", icon: <Clock size={18} className="text-yellow-600" /> },
  accepted: { bg: "bg-green-100",  icon: <Check size={18} className="text-green-600" /> },
  rejected: { bg: "bg-red-100",    icon: <X size={18} className="text-red-500" /> },
  done:     { bg: "bg-green-100",  icon: <CheckCircle size={18} className="text-green-600" /> },
  message:  { bg: "bg-blue-100",   icon: <MessageCircle size={18} className="text-blue-500" /> },
  approved: { bg: "bg-green-100",  icon: <Shield size={18} className="text-green-600" /> },
  expired:  { bg: "bg-orange-100", icon: <AlarmClock size={18} className="text-orange-500" /> },
  rating:   { bg: "bg-yellow-100", icon: <Star size={18} className="text-yellow-500" /> },
  default:  { bg: "bg-gray-100",   icon: <Bell size={18} className="text-gray-500" /> },
};

export default function NotificationItem({ notif, onAccept, onReject, isLast = false }) {
  const s = TYPE_STYLE[notif.type] || TYPE_STYLE.default;

  return (
    <div className={`px-5 py-[18px] flex gap-3.5 items-start relative ${isLast ? "" : "border-b border-gray-100"} ${notif.read ? "bg-white" : "bg-[#fafffe]"}`}>
      {!notif.read && (
        <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-teal-dark" />
      )}
      <div className={`w-10 h-10 rounded-full shrink-0 ${s.bg} flex items-center justify-center`}>
        {s.icon}
      </div>
      <div className="flex-1">
        <div className="font-bold text-sm text-gray-900 mb-1">{notif.title}</div>
        <div className="text-[13px] text-gray-700 leading-relaxed mb-1.5">{notif.body}</div>
        <div className={`text-xs text-gray-400 ${notif.actions ? "mb-2.5" : ""}`}>{notif.time}</div>
        {notif.actions && (
          <div className="flex gap-2">
            <button
              onClick={() => onAccept?.(notif.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold text-[13px] cursor-pointer hover:bg-gray-800 transition-all duration-200"
            >
              <Check size={14} /> Accept
            </button>
            <button
              onClick={() => onReject?.(notif.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg font-semibold text-[13px] cursor-pointer hover:bg-gray-50 transition-all duration-200"
            >
              <X size={14} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}