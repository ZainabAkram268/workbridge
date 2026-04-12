import React, { useEffect, useState } from "react";
import {
  LayoutDashboard, ShieldCheck, HardHat, Briefcase, LogOut,
  Users, UserCheck, CheckCircle, Clock,
  ClipboardList, CircleCheck, Settings, PartyPopper, XCircle,
  Plus,
} from "lucide-react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import CreateWorkerModal from "../../components/admin/CreateWorkerModal";
import WorkerReviewModal from "../../components/admin/WorkerReviewModal";
import PendingWorkerRow from "../../components/admin/PendingWorkerRow";

function initials(n = "") {
  return n.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

const MOCK_METRICS = {
  totalWorkers: 48,
  totalEmployers: 132,
  activeWorkers: 0,
  pendingVerifications: 0,
  jobStats: {
    today: { Requested: 14, Accepted: 9, "In Progress": 6, Completed: 31, Rejected: 3 },
  },
};

const MOCK_PENDING = [
  { _id: "w1", userId: { fullName: "Rizwan Ahmed" }, services: ["Drivers", "Gardeners"], submittedAt: "2025-03-12", daysWaiting: 2, phone: "0301-2345678", preferredCity: "Lahore" },
  { _id: "w2", userId: { fullName: "Amna Bibi" }, services: ["Domestic Helpers", "Cooks"], submittedAt: "2025-03-13", daysWaiting: 1, phone: "0321-9876543", preferredCity: "Karachi" },
  { _id: "w3", userId: { fullName: "Tariq Mehmood" }, services: ["Plumbers"], submittedAt: "2025-03-14", daysWaiting: 0, phone: "0333-1234567", preferredCity: "Islamabad" },
];

const MOCK_ALL_WORKERS = [
  { _id: "aw1", userId: { fullName: "Rizwan Ahmed" }, phone: "0301-2345678", preferredCity: "Lahore", services: ["Drivers", "Gardeners"], status: "verified" },
  { _id: "aw2", userId: { fullName: "Amna Bibi" }, phone: "0321-9876543", preferredCity: "Karachi", services: ["Domestic Helpers", "Cooks"], status: "pending" },
  { _id: "aw3", userId: { fullName: "Tariq Mehmood" }, phone: "0333-1234567", preferredCity: "Islamabad", services: ["Plumbers"], status: "verified" },
  { _id: "aw4", userId: { fullName: "Sara Khan" }, phone: "0311-7654321", preferredCity: "Lahore", services: ["Babysitters"], status: "admin_created" },
];

// Teal / gray palette only
const STATUS_COLORS = {
  Requested:     "#111827",   // gray-900
  Accepted:      "#14b8a6",   // teal-500
  "In Progress": "#6b7280",   // gray-500
  Completed:     "#0f766e",   // teal-700
  Rejected:      "#d1d5db",   // gray-300
};

const STATUS_BG = {
  Requested:     "bg-gray-100 text-gray-600",
  Accepted:      "bg-gray-900 text-white",
  "In Progress": "bg-gray-100 text-gray-600",
  Completed:     "bg-teal-light text-teal-dark",
  Rejected:      "bg-gray-200 text-gray-500",
};

const STATUS_ICON = {
  Requested:    <ClipboardList className="w-4 h-4" />,
  Accepted:     <CircleCheck   className="w-4 h-4" />,
  "In Progress":<Settings      className="w-4 h-4" />,
  Completed:    <PartyPopper   className="w-4 h-4" />,
  Rejected:     <XCircle       className="w-4 h-4" />,
};

const BAR_COLOR = {
  Completed:     "bg-teal-600",
  Accepted:      "bg-teal-400",
  "In Progress": "bg-gray-400",
  Requested:     "bg-gray-700",
  Rejected:      "bg-gray-300",
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [metrics, setMetrics]           = useState(MOCK_METRICS);
  const [pending, setPending]           = useState(MOCK_PENDING);
  const [allWorkers, setAllWorkers]     = useState(MOCK_ALL_WORKERS);
  const [activeTab, setActiveTab]       = useState("overview");
  const [reviewing, setReviewing]       = useState(null);
  const [createWorker, setCreateWorker] = useState(false);

  const fetchAllWorkers = () => {
    api.get("/admin/workers")
      .then((d) => { if (d?.length) setAllWorkers(d); })
      .catch(() => {});
  };

 const fetchDashboard = () => {
  api.get("/admin/dashboard")
    .then((d) => {
      if (d?.totalWorkers) {
        setMetrics((prev) => ({ ...prev, ...d, jobStats: d.jobStats || prev.jobStats }));
      }
    })
    .catch(() => {});
};
useEffect(() => {
  fetchDashboard();
  api.get("/admin/workers/pending").then((d) => { if (d?.length) setPending(d); }).catch(() => {});
  fetchAllWorkers();

  // ✅ Poll every 30s to pick up other members' job stat changes (Completed, In Progress, etc.)
  const interval = setInterval(() => {
    fetchDashboard();
    fetchAllWorkers();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  const approve = async (id) => {
  try { await api.patch(`/admin/workers/${id}/approve`); } catch {}
  const approvedWorker = pending.find((p) => p._id === id);
  setPending((ps) => ps.filter((p) => p._id !== id));
  if (approvedWorker) {
    setAllWorkers((prev) => [...prev, { ...approvedWorker, status: "verified" }]);
  }
  setMetrics((prev) => ({
    ...prev,
    // ✅ Total workers goes up, pending review goes down
    totalWorkers: (prev.totalWorkers || 0) + 1,
    pendingVerifications: Math.max(0, (prev.pendingVerifications || 0) - 1),
    // ✅ Active workers goes up (newly verified = active)
    activeWorkers: (prev.activeWorkers || 0) + 1,
    jobStats: {
      ...prev.jobStats,
      today: {
        ...prev.jobStats.today,
        Accepted: (prev.jobStats.today.Accepted || 0) + 1,
      },
    },
  }));
  setReviewing(null);
};

const reject = async (id, reason) => {
  try { await api.patch(`/admin/workers/${id}/reject`, { reason }); } catch {}
  const rejectedWorker = pending.find((p) => p._id === id);
  setPending((ps) => ps.filter((p) => p._id !== id));
  if (rejectedWorker) {
    setAllWorkers((prev) => [...prev, { ...rejectedWorker, status: "rejected" }]);
  }
  setMetrics((prev) => ({
    ...prev,
    // ✅ Pending review goes down, rejected worker NOT added to totalWorkers
    pendingVerifications: Math.max(0, (prev.pendingVerifications || 0) - 1),
    jobStats: {
      ...prev.jobStats,
      today: {
        ...prev.jobStats.today,
        Rejected: (prev.jobStats.today.Rejected || 0) + 1,
      },
    },
  }));
  setReviewing(null);
};

  const navItems = [
    { id: "overview", icon: <LayoutDashboard className="w-4 h-4" />, label: "Overview" },
    { id: "verify",   icon: <ShieldCheck     className="w-4 h-4" />, label: "Verify Workers" },
    { id: "workers",  icon: <HardHat         className="w-4 h-4" />, label: "All Workers" },
    { id: "jobs",     icon: <Briefcase       className="w-4 h-4" />, label: "Job Stats" },
  ];

  const metricCards = [
    { label: "Total Workers",   value: metrics.totalWorkers,        icon: <HardHat   className="w-5 h-5 text-white" />, bg: "bg-gray-900" },
    { label: "Total Employers", value: metrics.totalEmployers,       icon: <Users     className="w-5 h-5 text-white" />, bg: "bg-gray-900" },
    { label: "Active Workers",  value: metrics.activeWorkers,        icon: <UserCheck className="w-5 h-5 text-white" />, bg: "bg-gray-900" },
    { label: "Pending Review",  value: metrics.pendingVerifications, icon: <Clock     className="w-5 h-5 text-white" />, bg: "bg-gray-900" },
  ];

  const todayStats = metrics.jobStats?.today || {};
  const totalJobs  = Object.values(todayStats).reduce((a, b) => a + b, 0);
  const chartData  = Object.entries(todayStats).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <aside className="fixed top-0 left-0 h-full w-56 bg-gray-900 flex flex-col z-30">
        <div className="px-5 pt-6 pb-4">
          <div className="text-white text-xl font-extrabold">
            Work<span className="text-teal">Bridge</span>
          </div>
          <div className="text-gray-500 text-xs font-bold mt-1 uppercase tracking-widest">Admin Panel</div>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-2 pb-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 transition-all"
          >
            <LogOut className="w-4 h-4" /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 ml-56 p-8">

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <>
            <div className="flex justify-between items-start mb-7">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Platform overview and key metrics</p>
              </div>
              <button
                onClick={() => setCreateWorker(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Worker Account
              </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-4 mb-7">
              {metricCards.map((c) => (
                <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-2">{c.label}</div>
                    <div className="text-3xl font-black text-gray-900">{c.value ?? 0}</div>
                  </div>
                  <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
                    {c.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Donut Chart */}
            {Object.keys(todayStats).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-sm font-bold text-gray-700 mb-6">Today's Job Activity</h2>
                <div className="flex items-center gap-10">

                  {/* Chart */}
                  <div style={{ width: 200, height: 200, flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {chartData.map(({ name }) => (
                            <Cell key={name} fill={STATUS_COLORS[name] || "#e5e7eb"} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #f3f4f6",
                            fontSize: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          }}
                          formatter={(value, name) => [value, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-3 flex-1">
                    {Object.entries(todayStats).map(([status, count]) => (
                      <div key={status} className="flex items-center gap-3">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: STATUS_COLORS[status] }}
                        />
                        <span className="text-sm text-gray-600 flex-1">{status}</span>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                        <span className="text-xs text-gray-400 w-10 text-right">
                          {totalJobs ? Math.round((count / totalJobs) * 100) : 0}%
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-gray-100 pt-2 mt-1 flex justify-between">
                      <span className="text-xs text-gray-400 font-medium">Total</span>
                      <span className="text-xs font-bold text-gray-700">{totalJobs}</span>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        )}

        {/* ── Verify Workers Tab ── */}
        {activeTab === "verify" && (
          <>
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-gray-900">Verify Workers</h1>
              <p className="text-sm text-gray-500 mt-1">Review and approve pending worker profiles</p>
            </div>
<div className="max-w-3xl mx-auto">
    {pending.length === 0 ? (
    <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
      <CheckCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
      <div className="font-semibold">No pending verifications</div>
    </div>
  ) : (
    pending.map((worker, i) => (
      <PendingWorkerRow
        key={worker._id}
        worker={worker}
        onReview={(w) => setReviewing(w)}
        isLast={i === pending.length - 1}
      />
    ))
  )}
</div>
          </>
        )}

        {/* ── All Workers Tab ── */}
{activeTab === "workers" && (
  <>
    <div className="mb-7">
      <h1 className="text-2xl font-extrabold text-gray-900">All Workers</h1>
      <p className="text-sm text-gray-500 mt-1">Browse all registered workers on the platform</p>
    </div>

    {allWorkers.length === 0 ? (
      <div className="text-center py-16 text-gray-400">
        <HardHat className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <div className="font-semibold">No workers found</div>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allWorkers.map((worker) => {
          const statusStyle =
  worker.status === "verified"
    ? { barColor: "#14b8a6", badgeColor: "#f0fdfa", badgeText: "#0f766e", badgeBorder: "#99f6e4", label: "✓ Verified" }
    : worker.status === "rejected"
    ? { barColor: "#14b8a6", badgeColor: "#f9fafb", badgeText: "#6b7280", badgeBorder: "#d1d5db", label: "✕ Rejected" }
    : worker.status === "admin_created"
    ? { barColor: "#14b8a6", badgeColor: "#f0fdfa", badgeText: "#0d9488", badgeBorder: "#99f6e4", label: "⚙ Admin" }
    : { barColor: "#14b8a6", badgeColor: "#f0fdfa", badgeText: "#0d9488", badgeBorder: "#99f6e4", label: "◷ Pending" }

          return (
            <div
              key={worker._id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Coloured top bar */}
{/* Coloured top bar */}
<div className="h-1.5 w-full" style={{ backgroundColor: statusStyle.barColor }} />
              <div className="p-5">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {initials(worker.userId?.fullName)}
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-gray-900 leading-tight">
                      {worker.userId?.fullName}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{worker.phone}</div>
                  </div>
                  {/* Status badge pushed to right */}
                  <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle.badge}`}>
                    {statusStyle.label}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-50 mb-3" />

                {/* City */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium text-gray-600">{worker.preferredCity || "—"}</span>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-1.5">
                  {(worker.services || []).length === 0 ? (
                    <span className="text-xs text-gray-400">No services listed</span>
                  ) : (
                    worker.services.map((s) => (
                      <span
                        key={s}
                        className="bg-gray-900 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </>
)}

        {/* ── Job Stats Tab ── */}
        {activeTab === "jobs" && (
          <>
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-gray-900">Job Stats</h1>
              <p className="text-sm text-gray-500 mt-1">Platform-wide job activity and trends</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-5 gap-4 mb-7">
              {Object.entries(todayStats).map(([status, count]) => (
                <div key={status} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white">
  {STATUS_ICON[status] || <ClipboardList className="w-4 h-4" />}
</div>
                  <div className="text-2xl font-black text-gray-900">{count}</div>
                  <div className="text-xs font-semibold text-gray-500">{status}</div>
                </div>
              ))}
            </div>

{/* Bar Chart */}
<div className="bg-white rounded-2xl border border-gray-100 p-6">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-sm font-bold text-gray-700">Today's Breakdown</h2>
    <span className="text-xs text-gray-400 font-medium">Total: {totalJobs} jobs</span>
  </div>
  <ResponsiveContainer width="100%" height={280}>
<BarChart data={chartData} barSize={58} barCategoryGap="35%" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>   
     <XAxis
        dataKey="name"
        tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tick={{ fontSize: 12, fill: "#6b7280" }}
        axisLine={false}
        tickLine={false}
        allowDecimals={false}
      />
      <Tooltip
        contentStyle={{
          borderRadius: "12px",
          border: "1px solid #f3f4f6",
          fontSize: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
        cursor={{ fill: "#f9fafb" }}
        formatter={(value, name) => [value, name]}
      />
      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
        {chartData.map(({ name }) => (
          <Cell key={name} fill={STATUS_COLORS[name] || "#e5e7eb"} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
          </>
        )}

      </main>

      {/* ── Modals ── */}
      <CreateWorkerModal
        open={createWorker}
        onClose={() => setCreateWorker(false)}
onCreated={(newWorker) => {
  setCreateWorker(false);
  if (newWorker) {
    setAllWorkers((prev) => [...prev, newWorker]);
    setMetrics((prev) => ({
      ...prev,
      totalWorkers: (prev.totalWorkers || 0) + 1,
    }));
  } else {
    fetchAllWorkers();
  }
}}
      />

      <WorkerReviewModal
        open={!!reviewing}
        worker={reviewing}
        onClose={() => setReviewing(null)}
        onApprove={approve}
        onReject={reject}
      />
    </div>
  );
}