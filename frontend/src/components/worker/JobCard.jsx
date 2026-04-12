import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import StatusBadge from "../common/StatusBadge";
import {
  Check, CheckCircle, MessageCircle,
  Car, Brush, Leaf, Baby, ChefHat, Zap, Wrench, Shield,
} from "lucide-react";

const SERVICE_ICON = {
  Drivers: Car,
  "Domestic Helpers": Brush,
  Gardeners: Leaf,
  Babysitters: Baby,
  Cooks: ChefHat,
  Electricians: Zap,
  Plumbers: Wrench,
  "Security Guards": Shield,
};

// Single source of truth — must match WorkerDashboard and markDone status strings
const STEPS = ["Requested", "Accepted", "In Progress", "Awaiting Confirm", "Completed"];

export default function JobCard({ job, onMarkDone }) {
  const { user } = useAuth();
  const role = user?.role || "worker";
  const ServiceIcon = SERVICE_ICON[job.service] || Wrench;

  // Exact match first, fallback to partial for status string variants
  const exactIdx = STEPS.findIndex(s => s === job.status);
  const stepIdx = exactIdx !== -1
    ? exactIdx
    : STEPS.findIndex(s => job.status?.startsWith(s.split(" ")[0]));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 shadow-sm hover:shadow-lg transition-all duration-200">

      {/* Card Header */}
      <div className="flex justify-between items-start mb-3.5">
        <div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 text-teal-700">
              <ServiceIcon size={15} />
            </span>
            {job.service} — {job.hiringType}
          </h3>
          <p className="text-[13px] text-gray-500 m-0">
            {job.employerName} · {job.location}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Stepper */}
      <div className="flex items-start mb-4">
        {STEPS.map((s, i) => {
          const done = i <= stepIdx;
          const lineActive = i < stepIdx;
          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{
                    backgroundColor: done ? "#0d9488" : "#f3f4f6",
                    color: done ? "#ffffff" : "#9ca3af",
                    border: done ? "none" : "1px solid #e5e7eb",
                  }}
                >
                  {done ? <Check size={12} /> : i + 1}
                </div>
                <span
                  className="text-[9px] font-semibold whitespace-nowrap"
                  style={{ color: done ? "#0f766e" : "#9ca3af" }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-1 mb-3.5"
                  style={{ backgroundColor: lineActive ? "#0d9488" : "#e5e7eb" }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2.5">
        {job.status === "In Progress" && (
          <button
            onClick={onMarkDone}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-black transition-all duration-200"
          >
            <CheckCircle size={16} className="text-teal-400" /> Mark Job Done
          </button>
        )}
        <Link
          to={`/${role}/chat/${job._id}`}
          className="flex items-center gap-2 px-5 py-3 bg-teal-50 text-teal-700 border border-teal-100 rounded-xl font-semibold text-sm no-underline hover:bg-teal-100 transition-all duration-200"
        >
          <MessageCircle size={16} /> Message
        </Link>
      </div>
    </div>
  );
}