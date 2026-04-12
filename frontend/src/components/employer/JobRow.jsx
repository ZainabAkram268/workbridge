import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";
import StatusBadge from "../common/StatusBadge";
import {
  Car, Brush, Leaf, Baby, ChefHat,
  Zap, Wrench, Shield, Calendar, MessageCircle
} from "lucide-react";

const SERVICE_ICON = {
  Drivers: <Car size={16} />,
  "Domestic Helpers": <Brush size={16} />,
  Gardeners: <Leaf size={16} />,
  Babysitters: <Baby size={16} />,
  Cooks: <ChefHat size={16} />,
  Electricians: <Zap size={16} />,
  Plumbers: <Wrench size={16} />,
  "Security Guards": <Shield size={16} />,
};

export default function JobRow({
  job,
  onCancel,
  onConfirm,
  onRate,
  onRepost,
  isLast
}) {
  return (
    <div
      className={`
        grid grid-cols-5 gap-4 items-center px-5 py-4
        border-b border-gray-100
        ${isLast ? "border-b-0" : ""}
      `}
    >
      {/* SERVICE + DATE */}
      <div>
        <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
          {SERVICE_ICON[job.service] || <Wrench size={16} />}
          {job.service} — {job.hiringType}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <Calendar size={14} />
          {job.endDate
            ? `${job.jobDate} – ${job.endDate}`
            : job.jobDate}
        </div>
      </div>

      {/* WORKER */}
      <div className="flex items-center gap-2">
        <Avatar name={job.workerName || ""} size="sm" />
        <span className="text-sm font-medium text-gray-800 truncate">
          {job.workerName}
        </span>
      </div>

      {/* STATUS */}
      <div>
        <StatusBadge status={job.status} />
      </div>

      {/* AMOUNT */}
      <div className="font-bold text-sm text-gray-900">
        {job.amount ? `PKR ${job.amount.toLocaleString()}` : "—"}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 flex-wrap">

        {job.status === "Requested" && (
          <button
            onClick={() => onCancel?.(job._id)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg
                       bg-red-50 text-red-600 border border-red-200
                       hover:bg-red-100 transition"
          >
            Cancel
          </button>
        )}

        {job.status === "In Progress" && (
          <button
            onClick={() => onConfirm?.(job._id)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg
                       bg-emerald-50 text-emerald-600
                       hover:bg-emerald-100 transition"
          >
            Confirm Done
          </button>
        )}

        {job.status === "Completed" && !job.rated && (
          <button
            onClick={() => onRate?.(job._id)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg
                       bg-white text-gray-800 border border-gray-300
                       hover:bg-gray-50 transition"
          >
            Rate
          </button>
        )}

        {job.status === "Rejected" && (
          <button
            onClick={() => onRepost?.(job._id)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg
                       bg-white text-gray-800 border border-gray-300
                       hover:bg-gray-50 transition"
          >
            Re-post
          </button>
        )}

        {/* CHAT */}
        <Link
          to={`/employer/chat/${job._id}`}
          className="w-9 h-9 flex items-center justify-center
                     border border-gray-200 rounded-lg
                     text-gray-500 hover:bg-gray-50 transition"
        >
          <MessageCircle size={16} />
        </Link>
      </div>
    </div>
  );
}