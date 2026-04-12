import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { Star, MapPin, MessageCircle, Briefcase } from "lucide-react";

const SERVICE_EMOJI = {
  Drivers: "🚗", "Domestic Helpers": "🧹", Gardeners: "🌱",
  Babysitters: "👶", Cooks: "👨‍🍳", Electricians: "⚡",
  Plumbers: "🔧", "Security Guards": "🛡️", Handyman: "🔨", Cleaner: "✅",
};

export default function WorkerCard({ worker }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = worker.userId?.fullName || "Worker";
  const available = worker.availabilityBadge === "Available";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center">
          <Avatar name={name} size="md" />
          <div>
            <div className="font-bold text-base text-gray-900">{name}</div>
            <div className="text-[13px] text-gray-500">
              {worker.primaryService} · {worker.preferredDistrict}, {worker.preferredCity}
            </div>
            <div className="flex items-center gap-1 text-[13px] mt-0.5">
              <Star size={13} className="text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-800">{worker.averageRating?.toFixed(1)}</span>
              <span className="text-gray-400">({worker.totalReviews} reviews)</span>
            </div>
          </div>
        </div>
        <Badge variant={available ? "available" : "busy"} dot>
          {worker.availabilityBadge}
        </Badge>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-3.5">
        {(worker.services || [worker.primaryService]).map(s => (
          <span key={s} className="inline-flex items-center gap-1 bg-teal-light text-teal-dark px-2.5 py-0.5 rounded-full text-xs font-semibold">
            {SERVICE_EMOJI[s] || "🔧"} {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[13px] text-gray-500">
          <MapPin size={13} className="text-gray-400" />
          {worker.preferredDistrict}
          <span className="mx-1">·</span>
          <Briefcase size={13} className="text-gray-400" />
          {worker.completedJobs} jobs done
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/employer/workers/${worker._id}`)}
            className="w-9 h-9 border border-gray-200 rounded-lg bg-white cursor-pointer flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <MessageCircle size={16} />
          </button>
          <button
            onClick={() => { if (!user) { navigate("/login"); return; } navigate(`/employer/hire/${worker._id}`); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold text-[13px] cursor-pointer hover:bg-gray-800 transition-all duration-200"
          >
            <Briefcase size={14} /> Hire
          </button>
        </div>
      </div>
    </div>
  );
}