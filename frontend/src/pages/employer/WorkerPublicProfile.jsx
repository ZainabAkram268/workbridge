import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft, Star, Briefcase, MapPin, Clock,
  Calendar, ShieldCheck, DollarSign, Zap,
  CheckCircle2, UserCheck
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";

function initials(n = "") {
  return n.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

const MOCK = {
  _id: "1", userId: { fullName: "Ali Mahmood" }, primaryService: "Driver",
  services: ["Driver", "Cleaner"], preferredCity: "Lahore", preferredDistrict: "DHA",
  averageRating: 4.8, totalReviews: 23, completedJobs: 47, availabilityBadge: "Available",
  bio: "Experienced driver with 5+ years of professional driving experience in Lahore. Holds a valid driving license. Punctual, trustworthy, and familiar with all major routes in Lahore.",
  hourlyRate: 600, dailyRate: 2500, monthlyRate: 30000,
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], startTime: "8:00 AM", endTime: "6:00 PM", maxTravelDistance: 20,
  reviews: [
    { name: "Sara Baig",   stars: 5, text: "Very punctual and professional driver. Always on time. Highly recommended!", date: "March 2025" },
    { name: "Usman Khan",  stars: 5, text: "Excellent service, knows all routes in Lahore. My family felt very safe.",    date: "February 2025" },
    { name: "Fatima Asif", stars: 4, text: "Good work overall, very reliable. Would hire again.",                         date: "January 2025" },
  ],
};

const ratingBars = [
  { label: "5★", pct: 78 }, { label: "4★", pct: 17 },
  { label: "3★", pct: 5  }, { label: "2★", pct: 0  }, { label: "1★", pct: 0 },
];

export default function WorkerPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [worker, setWorker] = useState(MOCK);

  useEffect(() => {
    api.get(`/workers/${id}`).then(data => { if (data?._id) setWorker(data); }).catch(() => {});
  }, [id]);

  const handleHire = () => {
    if (!user) { navigate("/login"); return; }
    navigate(`/employer/hire/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar role="employer" />

      <main className="flex-1 ml-[232px]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6">

          {/* ── Left column ── */}
          <div className="w-72 flex-shrink-0 flex flex-col gap-5">

            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-xl shadow-slate-200">
                {initials(worker.userId?.fullName)}
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">{worker.userId?.fullName}</h2>
              <p className="text-xs font-medium text-slate-400 mb-4 flex items-center justify-center gap-1">
                <Briefcase size={12} /> {worker.primaryService} • <MapPin size={12} /> {worker.preferredCity}
              </p>

              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 border ${
                worker.availabilityBadge === "Available"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              }`}>
                <span className={`w-2 h-2 rounded-full ${worker.availabilityBadge === "Available" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                {worker.availabilityBadge} Now
              </span>

              <div className="text-sm text-slate-600 mb-5 flex items-center justify-center gap-1">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <strong className="text-slate-900">{worker.averageRating?.toFixed(1)}</strong>
                <span className="text-slate-400">({worker.totalReviews} reviews)</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <div className="text-[9px] text-slate-400 font-bold uppercase mb-1">Jobs Done</div>
                  <div className="text-xl font-black text-slate-900">{worker.completedJobs}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <div className="text-[9px] text-slate-400 font-bold uppercase mb-1">Response</div>
                  <div className="text-xl font-black text-slate-900 flex items-center justify-center gap-0.5">
                    <Zap size={14} className="text-emerald-500" />1h
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 justify-center mb-5">
                {(worker.services || [worker.primaryService]).map(s => (
                  <span key={s} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-lg border border-slate-200 uppercase tracking-tighter">{s}</span>
                ))}
              </div>

              <div className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-2.5 rounded-xl mb-5 flex items-center justify-center gap-2 border border-emerald-100">
                <ShieldCheck size={14} /> CNIC VERIFIED
              </div>

              {user ? (
                <button onClick={handleHire} className="w-full py-3.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  Hire {worker.userId?.fullName?.split(" ")[0]}
                </button>
              ) : (
                <div className="bg-slate-50 rounded-xl p-3 text-xs font-semibold text-slate-500 border border-slate-100">
                  <Link to="/login" className="text-emerald-600 hover:underline">Sign In to Contact</Link>
                </div>
              )}
            </div>

            {/* Service Rates */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <DollarSign size={14} className="text-emerald-600" /> Service Rates
              </h3>
              {[
                ["Hourly",   `PKR ${worker.hourlyRate?.toLocaleString()}/hr`],
                ["Daily",    `PKR ${worker.dailyRate?.toLocaleString()}/day`],
                ["Monthly",  `PKR ${worker.monthlyRate?.toLocaleString()}/mo`],
              ].map(([label, value], i, arr) => (
                <div key={label} className={`flex justify-between text-xs py-3 ${i < arr.length - 1 ? "border-b border-slate-50" : ""}`}>
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="font-bold text-slate-900">{value}</span>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} className="text-emerald-600" /> Availability
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(worker.days || ["Mon", "Tue", "Wed", "Thu", "Fri"]).map(d => (
                  <span key={d} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-100">{d}</span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mb-2 flex items-center gap-2">
                <Clock size={12} className="text-slate-400" /> {worker.startTime || "8:00 AM"} – {worker.endTime || "6:00 PM"}
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-2">
                <MapPin size={12} className="text-slate-400" /> Max {worker.maxTravelDistance || 20} km from {worker.preferredDistrict || "DHA"}
              </p>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Bio */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                <UserCheck size={18} className="text-emerald-600" /> About {worker.userId?.fullName?.split(" ")[0]}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {worker.bio || "Experienced professional with years of quality service. Trusted and verified by WorkBridge Pakistan."}
              </p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                <Star size={18} className="text-emerald-600" /> Reviews &amp; Ratings
              </h3>

              {/* Summary */}
              <div className="flex gap-10 items-center mb-8 pb-8 border-b border-slate-100">
                <div className="text-center bg-slate-50 p-6 rounded-3xl border border-slate-100 min-w-[140px]">
                  <div className="text-6xl font-black text-slate-900 leading-none">{worker.averageRating?.toFixed(1)}</div>
                  <div className="flex justify-center gap-0.5 text-amber-400 my-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.round(worker.averageRating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{worker.totalReviews} reviews</div>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  {ratingBars.map(b => (
                    <div key={b.label} className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-slate-400 w-5 tracking-tighter">{b.label}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${b.pct}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review list */}
              {worker.reviews?.length > 0 ? (
                <div className="flex flex-col divide-y divide-slate-50">
                  {worker.reviews.map((r, i) => (
                    <div key={i} className="py-6 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <strong className="text-sm font-black text-slate-900 tracking-tight">{r.name}</strong>
                        <div className="flex gap-0.5 text-amber-400">
                          {[...Array(r.stars)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 font-medium leading-relaxed">{r.text}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <Calendar size={10} /> {r.date} • <CheckCircle2 size={10} className="text-emerald-500" /> Verified Hire
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-10 font-medium">No ratings yet</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
