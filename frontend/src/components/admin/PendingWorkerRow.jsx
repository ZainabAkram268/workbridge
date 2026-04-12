import React from "react";
import { Wrench, Car, Home, Leaf, Baby, ChefHat, Zap, Shield, MapPin, Clock } from "lucide-react";

const SERVICE_ICON = {
  Drivers:           <Car        className="w-3 h-3" />,
  "Domestic Helpers":<Home       className="w-3 h-3" />,
  Gardeners:         <Leaf       className="w-3 h-3" />,
  Babysitters:       <Baby       className="w-3 h-3" />,
  Cooks:             <ChefHat    className="w-3 h-3" />,
  Electricians:      <Zap        className="w-3 h-3" />,
  Plumbers:          <Wrench     className="w-3 h-3" />,
  "Security Guards": <Shield     className="w-3 h-3" />,
};

export default function PendingWorkerRow({ worker, onReview }) {
  const urgency =
    worker.daysWaiting > 1
      ? { badge: "bg-red-50 text-red-600 border border-red-100",          label: `${worker.daysWaiting}d waiting` }
      : worker.daysWaiting === 1
      ? { badge: "bg-yellow-50 text-yellow-700 border border-yellow-100", label: "1d waiting" }
      : { badge: "bg-teal-50 text-teal-700 border border-teal-100",       label: "New today" };

  return (
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-5 overflow-hidden">
      {/* Teal top bar */}
<div className="h-0.5 w-full" style={{ backgroundColor: "#14b8a6" }} />
      <div className="flex items-center gap-5 px-5 py-4">

        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-11 h-11">
            <circle cx="20" cy="15" r="7" fill="white" fillOpacity="0.85"/>
            <ellipse cx="20" cy="34" rx="12" ry="8" fill="white" fillOpacity="0.85"/>
          </svg>
        </div>

        {/* Name + Phone */}
        <div className="w-36 flex-shrink-0">
          <div className="font-bold text-sm text-gray-900">{worker.userId?.fullName}</div>
          <div className="text-xs text-gray-400 mt-0.5">{worker.phone}</div>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5 flex-1">
          {(worker.services || []).map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 bg-gray-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
            >
              {SERVICE_ICON[s] || <Wrench className="w-3 h-3" />}
              {s}
            </span>
          ))}
        </div>

        {/* City */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 w-28 flex-shrink-0">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{worker.preferredCity || "—"}</span>
        </div>

        {/* Waiting badge */}
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${urgency.badge}`}>
            <Clock className="w-3 h-3" />
            {urgency.label}
          </span>
        </div>

        {/* Review button */}
        <button
          onClick={() => onReview(worker)}
          className="flex-shrink-0 bg-gray-900 hover:bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          Review →
        </button>

      </div>
    </div>
  );
}