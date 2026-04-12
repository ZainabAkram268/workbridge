import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, XCircle, MessageSquare, 
  Calendar, MapPin, Banknote, Clock, 
  Briefcase, AlertCircle, Star, 
  User as UserIcon, Bell, LogOut,
  ChevronRight, Info
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

const getInitials = (n = "") => n.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();

const REJECT_REASONS = [
  "Not available on that date",
  "Schedule conflict",
  "Too far from my location",
  "Preferred different hiring type",
  "Personal reasons"
];

const JOB_STEPS = ["Requested", "Accepted", "In Progress", "Awaiting Confirm", "Completed"];

export default function WorkerDashboard() {
const { user, logout } = useAuth();
const role = user?.role || "worker";
  const [jobs, setJobs] = useState([
    { _id:"j1", employerName:"Sara Baig",   service:"Drivers",   hiringType:"Daily",  jobDate:"2025-03-16", location:"DHA Phase 5", description:"Need a reliable driver for the full day.", amount:2500, status:"Requested" },
    { _id:"j2", employerName:"Usman Khan",  service:"Drivers",   hiringType:"Weekly", jobDate:"2025-03-18", endDate:"2025-03-24", location:"Gulberg III", description:"Weekly driver needed for school pick-up.", amount:15000, status:"Requested" },
    { _id:"j3", employerName:"Fatima Asif", service:"Domestic Helpers", hiringType:"Hourly", jobDate:"2025-03-10", location:"Johar Town", amount:1200, status:"In Progress" },
  ]);
  const [profile, setProfile] = useState(null);
  const [rejectJobId, setRejectJobId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    api.get("/workers/me").then(setProfile).catch(() => {});
    api.get("/worker/jobs").then(d => { if(d?.length) setJobs(d); }).catch(() => {});
  }, []);

  const acceptJob = async (id) => {
    try { await api.patch(`/worker/jobs/${id}/accept`); } catch {}
    setJobs(js => js.map(j => j._id === id ? { ...j, status: "Accepted" } : j));
  };

  const rejectJob = async () => {
    if (!rejectReason) return;
    try { await api.patch(`/worker/jobs/${rejectJobId}/reject`, { reason: rejectReason }); } catch {}
    setJobs(js => js.map(j => j._id === rejectJobId ? { ...j, status: "Rejected" } : j));
    setRejectJobId(null); setRejectReason("");
  };

  const markDone = async (id) => {
    try { await api.patch(`/worker/jobs/${id}/done`); } catch {}
    setJobs(js => js.map(j => j._id === id ? { ...j, status: "Awaiting Confirmation" } : j));
  };

  const newRequests = jobs.filter(j => j.status === "Requested");
  const activeJobs = jobs.filter(j => ["Accepted", "In Progress", "Awaiting Confirmation"].includes(j.status));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-900">

      <main className="flex-1 ml-[232px] p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">My Jobs</h1>
            <p className="text-slate-500 font-medium mt-1">Real-time management of your service requests.</p>
          </div>

          {profile && (
            <div className="flex items-center gap-4 bg-white p-2 pr-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {getInitials(profile.userId?.fullName || user?.fullName)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">{profile.userId?.fullName || "Worker"}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center text-amber-500 text-[11px] font-bold">
                    <Star className="w-3 h-3 fill-current mr-0.5" /> {profile.averageRating || "0.0"}
                  </div>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="text-slate-500 text-[11px] font-semibold">{profile.completedJobs || 0} Jobs</span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">{profile.availabilityBadge || "Available"}</span>
              </div>
            </div>
          )}
        </header>

        {/* New Requests Section */}
        {newRequests.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-bold text-slate-800">New Requests</h2>
              <span className="px-2.5 py-0.5 bg-teal-100 text-teal-700 text-[11px] font-black rounded-full uppercase">
                {newRequests.length} Pending
              </span>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {newRequests.map(j => (
                <div key={j._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{j.service} — {j.hiringType}</h3>
                        <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                          {j.employerName} <span className="text-slate-200">•</span> {j.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> New
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-bold text-slate-700">{j.jobDate}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700">PKR {j.amount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed italic">
                    "{j.description}"
                  </p>

                  <div className="flex gap-3 mt-4">
                    {/* Accept Button */}
                    <button 
                        onClick={() => acceptJob(j._id)} 
                        className="flex-1 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4 text-teal-400" /> 
                        <span>Accept</span>
                    </button>

                    {/* Reject Button */}
                    <button 
                        onClick={() => setRejectJobId(j._id)} 
                        className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <XCircle className="w-4 h-4 text-red-400" /> 
                        <span>Reject</span>
                    </button>

                    {/* Chat Link - Fixed with title and dynamic role */}
                    <Link 
                        to={`/${role}/chat/${j._id}`}
                        title="Open Chat"
                        className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-teal-50 text-teal-600 border border-teal-100 rounded-xl hover:bg-teal-100 transition-all active:scale-95"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </Link>
                    </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Active Progress Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-slate-800">Active Tracking</h2>
          </div>
          
          <div className="space-y-6">
            {activeJobs.map(j => (
              <div key={j._id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{j.service}</h3>
                      <p className="text-sm font-medium text-slate-400">{j.employerName} <span className="mx-2">•</span> {j.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Earnings</p>
                    <p className="text-xl font-black text-slate-900">PKR {j.amount?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Stepper */}
                <div className="relative flex justify-between items-start mb-10 max-w-4xl mx-auto px-4">
                  <div className="absolute top-5 left-0 w-full h-[3px] bg-slate-100" />
                  <div className="absolute top-5 left-0 h-[3px] bg-teal-500 transition-all duration-700"
                    style={{ width: `${(JOB_STEPS.findIndex(s => j.status.includes(s)) / (JOB_STEPS.length - 1)) * 100}%` }}
                  />
                  {JOB_STEPS.map((step, idx) => {
                    const currentIdx = JOB_STEPS.findIndex(s => j.status.includes(s));
                    const isCompleted = idx <= currentIdx;
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-4 border-white shadow-sm
                          ${isCompleted ? 'bg-teal-500 text-white scale-110' : 'bg-white text-slate-300 border-slate-100'}`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-black">{idx + 1}</span>}
                        </div>
                        <span className={`mt-3 text-[10px] font-black uppercase tracking-wider transition-colors
                          ${isCompleted ? 'text-teal-600' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 border-t border-slate-50 pt-8">
                  {j.status === "In Progress" && (
                    <button onClick={() => markDone(j._id)} className="flex-[2] py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-sm tracking-wide transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" /> Complete Task & Mark Done
                    </button>
                  )}
                  {/* NEW CORRECTED CODE */}
                    <Link 
                    to={`/${role}/chat/${j._id}`} 
                    className="flex-1 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 no-underline"
                    >
                    <MessageSquare className="w-4 h-4 text-slate-400" /> Open Chat
                    </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Job Requests</h3>
            <p className="text-slate-500 mb-6">Your inbox is empty. Check back later!</p>
            <Link to="/worker/profile" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">
              Update My Profile
            </Link>
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {rejectJobId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Reject Request</h2>
                <p className="text-sm text-slate-500">Please provide a reason.</p>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              {REJECT_REASONS.map(r => (
                <button key={r} onClick={() => setRejectReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold
                    ${rejectReason === r ? "border-slate-900 bg-slate-900 text-white" : "border-slate-100 text-slate-600 hover:border-slate-200"}`}>
                  {r}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setRejectJobId(null)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-2">
                <ChevronRight className="w-4 h-4 rotate-180" /> Go Back
              </button>
              <button onClick={rejectJob} disabled={!rejectReason} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}