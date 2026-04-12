import React from "react";

export default function MetricCard({ label, value, icon, bgClass = "bg-gray-100" }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-start">
      <div>
        <div className="text-xs text-gray-500 font-medium mb-2">{label}</div>
        <div className="text-3xl font-black text-gray-900">{value ?? 0}</div>
      </div>
      <div className={`w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}