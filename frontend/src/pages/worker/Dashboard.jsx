import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ChevronRight, XCircle, Briefcase } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import JobRequestCard from "../../components/worker/JobRequestCard";
import JobCard from "../../components/worker/JobCard";

const REJECT_REASONS = [
  "Not available on that date",
  "Schedule conflict",
  "Too far from my location",
  "Preferred different hiring type",
  "Personal reasons",
];

const STATUS = {
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  AWAITING_CONFIRM: "Awaiting Confirm",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

const getInitials = (n = "") =>
  n.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export default function WorkerDashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([
    { _id: "j1", employerName: "Sara Baig", service: "Drivers", hiringType: "Daily", jobDate: "2025-03-16", location: "DHA Phase 5", description: "Need a reliable driver for the full day.", amount: 2500, status: STATUS.REQUESTED },
    { _id: "j2", employerName: "Usman Khan", service: "Drivers", hiringType: "Weekly", jobDate: "2025-03-18", endDate: "2025-03-24", location: "Gulberg III", description: "Weekly driver needed for school pick-up.", amount: 15000, status: STATUS.REQUESTED },
    { _id: "j3", employerName: "Fatima Asif", service: "Domestic Helpers", hiringType: "Hourly", jobDate: "2025-03-10", location: "Johar Town", amount: 1200, status: STATUS.IN_PROGRESS },
  ]);

  const [profile, setProfile] = useState(null);
  const [rejectJobId, setRejectJobId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    api.get("/workers/me").then(setProfile).catch(() => {});
    api.get("/worker/jobs").then((d) => { if (d?.length) setJobs(d); }).catch(() => {});
  }, []);

  const acceptJob = async (id) => {
    try { await api.patch(`/worker/jobs/${id}/accept`); } catch {}
    setJobs((js) => js.map((j) => (j._id === id ? { ...j, status: STATUS.ACCEPTED } : j)));
  };

  const rejectJob = async () => {
    if (!rejectReason) return;
    try { await api.patch(`/worker/jobs/${rejectJobId}/reject`, { reason: rejectReason }); } catch {}
    setJobs((js) => js.map((j) => (j._id === rejectJobId ? { ...j, status: STATUS.REJECTED } : j)));
    setRejectJobId(null);
    setRejectReason("");
  };

  const markDone = async (id) => {
    try { await api.patch(`/worker/jobs/${id}/done`); } catch {}
    setJobs((js) => js.map((j) => (j._id === id ? { ...j, status: STATUS.AWAITING_CONFIRM } : j)));
  };

  const newRequests = jobs.filter((j) => j.status === STATUS.REQUESTED);
  const activeJobs = jobs.filter((j) =>
    [STATUS.ACCEPTED, STATUS.IN_PROGRESS, STATUS.AWAITING_CONFIRM].includes(j.status)
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased text-slate-900">
      <main className="flex-1 p-8 max-w-5xl">

        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">My Jobs</h1>
            <p className="text-slate-500 font-medium mt-1">Real-time management of your service requests.</p>
          </div>
          {profile && (
            <div className="flex items-center gap-4 bg-white p-2 pr-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                {getInitials(profile.userId?.fullName || user?.fullName)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">{profile.userId?.fullName || "Worker"}</span>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-semibold">
                  <span className="text-amber-500">★ {profile.averageRating || "0.0"}</span>
                  <span className="text-slate-300">•</span>
                  <span>{profile.completedJobs || 0} Jobs</span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">{profile.availabilityBadge || "Available"}</span>
              </div>
            </div>
          )}
        </header>

        {newRequests.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-bold text-slate-800">New Requests</h2>
              <span className="px-2.5 py-0.5 bg-teal-100 text-teal-700 text-[11px] font-black rounded-full uppercase">
                {newRequests.length} Pending
              </span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {newRequests.map((j) => (
                <JobRequestCard key={j._id} job={j} onAccept={acceptJob} onReject={(id) => setRejectJobId(id)} />
              ))}
            </div>
          </section>
        )}

        {activeJobs.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-bold text-slate-800">Active Tracking</h2>
            </div>
            {activeJobs.map((j) => (
              <JobCard key={j._id} job={j} onMarkDone={() => markDone(j._id)} />
            ))}
          </section>
        )}

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

      {rejectJobId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
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
              {REJECT_REASONS.map((r) => (
                <button key={r} onClick={() => setRejectReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold
                    ${rejectReason === r ? "border-slate-900 bg-slate-900 text-white" : "border-slate-100 text-slate-600 hover:border-slate-200"}`}>
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setRejectJobId(null); setRejectReason(""); }}
                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-2">
                <ChevronRight className="w-4 h-4 rotate-180" /> Go Back
              </button>
              <button onClick={rejectJob} disabled={!rejectReason}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}