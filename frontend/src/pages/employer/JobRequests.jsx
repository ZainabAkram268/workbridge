import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import {
  Star, Calendar, CheckCircle,
  Clock, RefreshCcw, MessageSquare
} from "lucide-react";

function initials(n = "") {
  return n.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

const STATUS_TABS = [
  "All Jobs",
  "Pending",
  "In Progress",
  "Completed"
];

const MOCK_JOBS = [
  {
    _id: "j1",
    workerName: "Ali Mahmood",
    service: "Driver",
    hiringType: "Daily",
    jobDate: "2025-06-16",
    status: "Pending",
    amount: 2500
  },
  {
    _id: "j2",
    workerName: "Zara Fatima",
    service: "Cleaner",
    hiringType: "Hourly",
    jobDate: "2025-06-10",
    status: "In Progress",
    amount: 1200
  },
  {
    _id: "j3",
    workerName: "Nadia Akhtar",
    service: "Babysitter",
    hiringType: "Daily",
    jobDate: "2025-05-05",
    status: "Completed",
    amount: 2500,
    rating: 4,
    feedback: "Very professional",
    completedAt: "2 days ago"
  }
];

export default function JobRequests() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [activeTab, setActiveTab] = useState("All Jobs");

  const [ratingJobId, setRatingJobId] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  /* ---------------- FILTER ---------------- */

  const filtered =
    activeTab === "All Jobs"
      ? jobs
      : jobs.filter(j => j.status === activeTab);

  const countFor = (tab) =>
    tab === "All Jobs"
      ? jobs.length
      : jobs.filter(j => j.status === tab).length;

  /* ---------------- ACTIONS ---------------- */

  const markCompleted = (id) => {
    setJobs(js =>
      js.map(j =>
        j._id === id
          ? {
              ...j,
              status: "Completed",
              completedAt: "Just now"
            }
          : j
      )
    );
  };

  const submitRating = () => {
    if (!rating) return;

    setJobs(js =>
      js.map(j =>
        j._id === ratingJobId
          ? { ...j, rating, feedback }
          : j
      )
    );

    setRatingJobId(null);
    setRating(0);
    setFeedback("");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="employer" />

      <main className="flex-1 ml-[232px] p-6">

        {/* HEADER */}
        <h1 className="text-xl font-bold mb-4">My Jobs</h1>

        {/* TABS */}
        <div className="flex gap-2 mb-6">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-xs ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-white border"
              }`}
            >
              {tab} ({countFor(tab)})
            </button>
          ))}
        </div>

        {/* JOB LIST */}
        <div className="bg-white rounded-xl border overflow-hidden">

          {filtered.map((j, i) => (
            <div
              key={j._id}
              className={`p-4 flex flex-col gap-3 ${
                i !== filtered.length - 1 ? "border-b" : ""
              }`}
            >

              {/* TOP */}
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">
                    {initials(j.workerName)}
                  </div>

                  <div>
                    <div className="font-semibold">{j.workerName}</div>
                    <div className="text-xs text-gray-400 flex gap-2">
                      {j.service} • {j.hiringType}
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {j.jobDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="font-bold text-sm">
                  PKR {j.amount}
                </div>
              </div>

              {/* STATUS + ACTIONS */}
              <div className="flex justify-between items-center flex-wrap gap-2">

                {/* STATUS */}
                <div className="text-xs flex items-center gap-1">
                  {j.status === "Pending" && <Clock size={12} />}
                  {j.status === "In Progress" && <RefreshCcw size={12} />}
                  {j.status === "Completed" && <CheckCircle size={12} />}
                  {j.status}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">

                  {/* Pending / In Progress */}
                  {(j.status === "Pending" || j.status === "In Progress") && (
                    <>
                      <button
                        onClick={() => markCompleted(j._id)}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Mark Completed
                      </button>

                      <button
                        onClick={() => setRatingJobId(j._id)}
                        className="text-xs border px-3 py-1 rounded"
                      >
                        Rate
                      </button>
                    </>
                  )}

                  {/* Completed */}
                  {j.status === "Completed" && (
                    <>
                      {/* Show time */}
                      <span className="text-xs text-gray-400">
                        {j.completedAt}
                      </span>

                      {/* Show rating */}
                      {j.rating ? (
                        <div className="flex items-center gap-1 text-amber-500 text-xs">
                          {Array.from({ length: j.rating }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => setRatingJobId(j._id)}
                          className="text-xs border px-3 py-1 rounded"
                        >
                          Rate
                        </button>
                      )}
                    </>
                  )}

                  <button className="text-xs border px-3 py-1 rounded flex items-center gap-1">
                    <MessageSquare size={12} /> Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* RATING MODAL */}
      {ratingJobId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">

            <h2 className="font-bold mb-4">Rate Worker</h2>

            <div className="flex justify-center gap-2 mb-4">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)}>
                  <Star
                    className={s <= rating ? "text-yellow-400" : "text-gray-300"}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Feedback..."
              className="w-full border p-2 rounded mb-3 text-sm"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setRatingJobId(null)}
                className="flex-1 border py-2"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="flex-1 bg-black text-white py-2"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
