<<<<<<< Updated upstream
=======
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Clock, 
  Calendar, 
  CalendarDays, 
  MapPin, 
  User, 
  CheckCircle2, 
  ChevronLeft, 
  Briefcase,
  ArrowRight,
  Info
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import Sidebar from "../../components/layout/Sidebar";

function initials(n = "") { return n.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase(); }

const HIRE_TYPES = [
  { id: "Hourly",  icon: Clock, label: "Hourly" },
  { id: "Daily",   icon: Calendar, label: "Daily" },
  { id: "Weekly",  icon: CalendarDays, label: "Weekly" },
  { id: "Monthly", icon: Briefcase, label: "Monthly" },
];

const MOCK_WORKER = {
  _id: "1", userId: { fullName: "Ali Mahmood" }, primaryService: "Driver",
  preferredDistrict: "DHA Lahore", averageRating: 4.8, availabilityBadge: "Available",
  hourlyRate: 600, dailyRate: 2500, weeklyRate: 15000, monthlyRate: 30000,
};

export default function SendJobRequest() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [worker, setWorker]     = useState(MOCK_WORKER);
  const [hireType, setHireType] = useState("Hourly");
  const [jobDate, setJobDate]   = useState("");
  const [endDate, setEndDate]   = useState("");
  const [hours, setHours]       = useState(1);
  const [location, setLocation] = useState("");
  const [desc, setDesc]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    api.get(`/workers/${workerId}`).then(d => { if (d?._id) setWorker(d); }).catch(() => {});
  }, [workerId]);

  const getRate = () => {
    if (hireType === "Hourly")  return worker.hourlyRate  || 600;
    if (hireType === "Daily")   return worker.dailyRate   || 2500;
    if (hireType === "Weekly")  return worker.weeklyRate  || 15000;
    if (hireType === "Monthly") return worker.monthlyRate || 30000;
    return 0;
  };

  const getQty = () => {
    if (hireType === "Hourly")  return hours;
    if (hireType === "Daily")   return 1;
    if (hireType === "Weekly") {
      if (!jobDate || !endDate) return 1;
      const diff = (new Date(endDate) - new Date(jobDate)) / (1000 * 60 * 60 * 24 * 7);
      return Math.max(1, Math.ceil(diff));
    }
    if (hireType === "Monthly") return 1;
    return 1;
  };

  const getUnit = () => ({ Hourly: "hr", Daily: "day", Weekly: "week", Monthly: "month" }[hireType]);
  const estimated = getRate() * getQty();
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDate) return setError("Job date is required");
    if (!location.trim()) return setError("Location is required");
    if (new Date(jobDate) <= new Date()) return setError("Job date must be in the future");
    if ((hireType === "Weekly" || hireType === "Monthly") && !endDate) return setError("End date is required for this hire type");
    setError(""); setLoading(true);
    try {
      await api.post("/employer/jobs", {
        workerId, hiringType: hireType, jobDate,
        endDate: (hireType === "Weekly" || hireType === "Monthly") ? endDate : undefined,
        hours: hireType === "Hourly" ? hours : undefined,
        location, description: desc,
      });
      navigate("/employer/jobs");
    } catch (err) {
      setError(err.message || "Failed to send job request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar role="employer" />

      <main className="flex-1 ml-[232px]">
        <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <span className="inline-block text-[10px] font-bold tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-3 uppercase">Job Request</span>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Send Job Request</h1>
          <p className="text-sm text-slate-500">Fill in the details and we'll notify the worker instantly.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center justify-between mb-6 shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {initials(worker.userId?.fullName)}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base">{worker.userId?.fullName}</div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span className="flex items-center gap-1"><MapPin size={12}/> {worker.preferredDistrict}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">★ {worker.averageRating}</span>
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>Available
          </span>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-5 text-sm text-rose-600 flex items-center gap-2">
            <Info size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-3 block">
              Hiring Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {HIRE_TYPES.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id} type="button"
                    onClick={() => setHireType(t.id)}
                    className={`py-5 rounded-xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      hireType === t.id
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                    }`}
                  >
                    <Icon size={24} strokeWidth={hireType === t.id ? 2.5 : 1.5} />
                    <div className="text-[10px] font-bold uppercase tracking-wider">{t.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* Removed 'block' to fix conflict with 'flex' */}
              <label className="text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14}/> Job Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date" min={today} value={jobDate}
                onChange={e => setJobDate(e.target.value)} required
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition-all"
              />
            </div>
            {hireType === "Hourly" && (
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock size={14}/> Hours Needed
                </label>
                <select
                  value={hours} onChange={e => setHours(Number(e.target.value))}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(h => <option key={h} value={h}>{h} hour{h > 1 ? "s" : ""}</option>)}
                </select>
              </div>
            )}
            {(hireType === "Weekly" || hireType === "Monthly") && (
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <CalendarDays size={14}/> End Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date" min={jobDate || today} value={endDate}
                  onChange={e => setEndDate(e.target.value)} required
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition-all"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin size={14}/> Location / Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="text" placeholder="House No. 23, Block E, Johar Town"
              value={location} onChange={e => setLocation(e.target.value)} required
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase size={14}/> Job Description
              <span className="font-normal text-slate-400 text-xs ml-auto">(Max 300 chars)</span>
            </label>
            <textarea
              rows={3} maxLength={300}
              placeholder="Provide a few details about the work..."
              value={desc} onChange={e => setDesc(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition-all resize-none"
            />
          </div>

          <div className="bg-slate-900 rounded-2xl px-6 py-6 text-white shadow-xl shadow-slate-200">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Estimated Cost</div>
            <div className="text-4xl font-black flex items-baseline gap-2">
              <span className="text-emerald-400 text-xl font-bold">PKR</span>
              {estimated.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-2 border-t border-slate-800 pt-2 flex justify-between">
              <span>Rate: {getRate().toLocaleString()}/{getUnit()}</span>
              <span>Qty: {getQty()} {getUnit()}{getQty() > 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600"/> Request Summary
              </h3>
              {[
                ["Hire Type", hireType],
                ["Duration",  hireType === "Hourly" ? `${hours} hour${hours > 1 ? "s" : ""}` : hireType === "Daily" ? "1 day" : hireType === "Weekly" ? "Weekly" : "Monthly"],
                ["Total Est.", `PKR ${estimated.toLocaleString()}`],
              ].map(([l, v], i, arr) => (
                <div key={l} className={`flex justify-between text-xs py-2.5 ${i < arr.length - 1 ? "border-b border-slate-50" : ""}`}>
                  <span className="text-slate-500 font-medium">{l}</span>
                  <span className="font-bold text-slate-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Info size={14} className="text-emerald-600"/> How It Works
              </h3>
              {[
                "Request is sent",
                "Worker reviews it",
                "24h to respond",
                "Job starts on date",
              ].map((s, i) => (
                <div key={i} className="text-[11px] text-slate-600 mb-2 flex gap-2 font-medium">
                  <span className="text-emerald-600 font-bold">{i + 1}.</span>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white text-base font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? "Sending..." : "Send Job Request"} <ArrowRight size={18} />
          </button>
          <p className="text-center text-[10px] text-slate-400 -mt-2 font-medium">
            Worker has 24 hours to accept or reject your request
          </p>
        </form>
      </div>
      </main>
    </div>
  );
}
>>>>>>> Stashed changes
