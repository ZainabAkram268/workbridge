import React from "react";
import { Link } from "react-router-dom";
import {
  Car, Brush, Leaf, Baby, ChefHat, Zap, Wrench, Shield,
  Clock, CalendarDays, Banknote, CheckCircle, XCircle, MessageCircle,
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

export default function JobRequestCard({ job, onAccept, onReject }) {
  const ServiceIcon = SERVICE_ICON[job.service] || Wrench;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-200 relative">

      {/* Pending Badge */}
      <div className="absolute top-4 right-4">
        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
          <Clock size={11} /> Pending
        </span>
      </div>

      {/* Header */}
      <h3 className="text-[15px] font-bold text-gray-900 mb-1 pr-20 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-teal-light text-teal-dark shrink-0">
          <ServiceIcon size={15} />
        </span>
        {job.service} — {job.hiringType} Hire
      </h3>
      <p className="text-[13px] text-gray-500 mb-3">
        {job.employerName} · {job.location}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-800 px-2.5 py-1 rounded-md text-xs font-semibold">
          <CalendarDays size={12} />
          {job.endDate ? `${job.jobDate} – ${job.endDate}` : job.jobDate}
        </span>
        {job.amount && (
          <span className="flex items-center gap-1.5 bg-teal-light text-teal-dark px-2.5 py-1 rounded-md text-xs font-semibold">
            <Banknote size={12} /> PKR {job.amount.toLocaleString()}
          </span>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <p className="text-[13px] text-gray-700 mb-3.5 leading-relaxed">
          {job.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2.5">
        <button
          onClick={() => onAccept(job._id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all duration-200 cursor-pointer"
        >
          <CheckCircle size={15} /> Accept
        </button>
        <button
          onClick={() => onReject(job._id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all duration-200 cursor-pointer"
        >
          <XCircle size={15} /> Reject
        </button>
        <Link
          to={`/employer/chat/${job._id}`}
          className="flex items-center justify-center px-4 py-2.5 bg-teal-light text-teal-dark rounded-xl font-semibold text-sm no-underline hover:bg-teal-100 transition-all duration-200"
        >
          <MessageCircle size={16} />
        </Link>
      </div>
    </div>
  );
}