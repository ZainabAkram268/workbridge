import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import {
  Check, CheckCircle, MessageCircle,
  Car, Brush, Leaf, Baby, ChefHat, Zap, Wrench, Shield
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

const STEPS = ["Requested", "Accepted", "In Progress", "Awaiting Confirm", "Completed"];

export default function JobCard({ job, onMarkDone }) {
  const stepIdx = STEPS.findIndex(s =>
    s.toLowerCase().includes((job.status || "").toLowerCase().split(" ")[0])
  );

  const ServiceIcon = SERVICE_ICON[job.service] || Wrench;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start mb-3.5">
        <div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-teal-light text-teal-dark">
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

      <div className="flex items-center mb-4">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${i <= stepIdx ? "bg-teal-dark" : "bg-gray-200"}`}>
                {i <= stepIdx ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap ${i <= stepIdx ? "text-teal-dark" : "text-gray-400"}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-3.5 ${i < stepIdx ? "bg-teal-dark" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex gap-2.5">
        {job.status === "In Progress" && (
          <button
            onClick={onMarkDone}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-800 transition-all duration-200"
          >
            <CheckCircle size={16} /> Mark Job Done
          </button>
        )}
        <Link
          to={`/employer/chat/${job._id}`}
          className="flex items-center gap-2 px-5 py-3 bg-teal-light text-teal-dark rounded-xl font-semibold text-sm no-underline hover:bg-teal-100 transition-all duration-200"
        >
          <MessageCircle size={16} /> Message
        </Link>
      </div>
    </div>
  );
}