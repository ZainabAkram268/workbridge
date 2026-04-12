// src/services/mockApi.js
import {
  mockEmployerToken,
  mockWorkerToken,
  mockAdminToken,
  mockWorkers,
  mockJobs,
  mockWorkerJobs,
  mockNotifications,
  mockMessages,
  mockServiceTypes,
  mockDashboardMetrics,
  mockWorkerProfile,
  mockAllWorkers,
} from "./mockData";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ─── POST ─────────────────────────────────────────────────────────────────────
const post = async (url, data) => {

  if (url === "/auth/login") {
    await delay();
    let token = mockEmployerToken;
    if (data.password === "worker123") token = mockWorkerToken;
    else if (data.password === "admin123") token = mockAdminToken;
    let role = "employer";
    if (data.password === "worker123") role = "worker";
    else if (data.password === "admin123") role = "admin";
    return { token, role };
  }

  if (url === "/auth/verify-otp") {
    await delay();
    return { message: "OTP verified successfully" };
  }

  if (url === "/auth/resend-otp") {
    await delay();
    return { message: "OTP resent successfully" };
  }

  if (url === "/auth/register/employer") {
    await delay(600);
    return { message: "Employer registered. OTP sent.", phone: data.phone };
  }

  if (url === "/auth/register/worker") {
    await delay(600);
    return { message: "Worker registered. Pending admin approval.", phone: data.phone };
  }

  if (url === "/employer/jobs") {
    await delay();
    return {
      _id: "job_new_" + Date.now(),
      employer: { _id: "user_001", name: "Ahmed Raza" },
      worker: mockWorkers.find((w) => w._id === data.workerId) || mockWorkers[0],
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
  }

  if (url.includes("/rate")) {
    await delay();
    return { message: "Rating submitted successfully" };
  }

  // ADMIN CREATE WORKER
  if (url === "/admin/workers/create") {
    await delay(500);
    const newWorker = {
      _id: "aw_" + Date.now(),
      userId: { fullName: data.fullName },
      phone: data.phone,
      preferredCity: data.preferredCity,
      services: [],
      status: "admin_created",
    };
    mockAllWorkers.push(newWorker);
    return { message: "Worker created successfully", worker: newWorker };
  }

  await delay();
  return { message: "Success" };
};

// ─── GET ──────────────────────────────────────────────────────────────────────
const get = async (url, config) => {
  const filters = config?.params || {};

  if (url === "/employer/workers") {
    let results = [...mockWorkers];
    if (filters.serviceType) {
      results = results.filter((w) =>
        w.serviceType.name.toLowerCase().includes(filters.serviceType.toLowerCase())
      );
    }
    if (filters.city) {
      results = results.filter((w) =>
        w.location.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.isAvailable !== undefined) {
      results = results.filter((w) => w.isAvailable === filters.isAvailable);
    }
    return delay().then(() => results);
  }

  if (url === "/jobs") return delay().then(() => mockJobs);

  if (url.match(/^\/jobs\/[\w]+$/)) {
    const id = url.split("/").pop();
    return delay().then(
      () => mockJobs.find((j) => j._id === id) || mockWorkerJobs.find((j) => j._id === id) || mockJobs[0]
    );
  }

  if (url === "/employer/jobs") return delay().then(() => mockJobs);
  if (url === "/workers/jobs")  return delay().then(() => mockWorkerJobs);
  if (url === "/notifications") return delay().then(() => mockNotifications);
  if (url === "/service-types") return delay().then(() => mockServiceTypes);
  if (url === "/admin/dashboard") return delay().then(() => mockDashboardMetrics);

  if (url === "/admin/workers/pending")
    return delay().then(() => mockDashboardMetrics.recentWorkers);

  // ADMIN ALL WORKERS
  if (url === "/admin/workers") return delay().then(() => [...mockAllWorkers]);

  if (url.match(/^\/workers\/[\w]+\/profile$/)) return delay().then(() => mockWorkerProfile);
  if (url === "/workers/profile") return delay().then(() => mockWorkerProfile);
  if (url.match(/^\/messages\/[\w]+$/)) return delay().then(() => mockMessages);

  return delay().then(() => []);
};

// ─── PATCH ────────────────────────────────────────────────────────────────────
const patch = async (url, data) => {
  await delay(300);
  if (url.includes("/cancel"))  return { message: "Job cancelled" };
  if (url.includes("/confirm")) return { message: "Job confirmed" };
  if (url.includes("/accept"))  return { message: "Job accepted" };
  if (url.includes("/done"))    return { message: "Job marked as done" };

  // ✅ Worker approve — move from pending to allWorkers as verified
  if (url.match(/\/admin\/workers\/.+\/approve/)) {
    const id = url.split("/")[3];
    const idx = mockDashboardMetrics.recentWorkers.findIndex((w) => w._id === id);
    if (idx !== -1) {
      const [worker] = mockDashboardMetrics.recentWorkers.splice(idx, 1);
      mockAllWorkers.push({ ...worker, status: "verified" });
    }
    return { message: "Worker approved" };
  }

  // ✅ Worker reject — move from pending to allWorkers as rejected
  if (url.match(/\/admin\/workers\/.+\/reject/)) {
    const id = url.split("/")[3];
    const idx = mockDashboardMetrics.recentWorkers.findIndex((w) => w._id === id);
    if (idx !== -1) {
      const [worker] = mockDashboardMetrics.recentWorkers.splice(idx, 1);
      mockAllWorkers.push({ ...worker, status: "rejected" });
    }
    return { message: "Worker rejected" };
  }

  if (url.includes("/reject"))  return { message: "Job rejected" };
  if (url === "/workers/availability") return { message: "Availability updated" };
  return { message: "Updated successfully" };
};

// ─── PUT / DELETE ─────────────────────────────────────────────────────────────
const put = async (url, data) => { await delay(400); return { message: "Updated" }; };
const del = async (url)        => { await delay(300); return { message: "Deleted" }; };

// ─── MOCK SOCKET ──────────────────────────────────────────────────────────────
export const mockSocket = {
  _listeners: {},
  emit(event, ...args) {
    if (event === "get_messages") {
      setTimeout(() => {
        (this._listeners["messages"] || []).forEach((h) => h(mockMessages));
      }, 300);
    }
    if (event === "send_message") {
      const payload = args[0];
      const newMsg = {
        _id: "msg_" + Date.now(),
        jobId: payload.jobId,
        senderId: "user_001",
        receiverId: payload.receiverId,
        text: payload.text,
        createdAt: new Date().toISOString(),
      };
      setTimeout(() => {
        (this._listeners["new_message"] || []).forEach((h) => h(newMsg));
      }, 200);
    }
  },
  on(event, handler) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(handler);
  },
  off(event) { this._listeners[event] = []; },
};

const mockApi = { get, post, patch, put, delete: del };
export default mockApi;