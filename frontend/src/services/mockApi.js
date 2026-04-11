// src/services/mockApi.js
// Drop-in replacement for the real axios api instance.

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
} from "./mockData";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ─── POST ────────────────────────────────────────────────────────────────────
const post = async (url, data) => {

  // LOGIN — returns a real decodable JWT so AuthContext works correctly
  // password "worker123" → worker, "admin123" → admin, else → employer
  if (url === "/auth/login") {
    await delay();
    let token = mockEmployerToken;
    if (data.password === "worker123") token = mockWorkerToken;
    else if (data.password === "admin123") token = mockAdminToken;

    // Also derive role for Login.jsx's ROLE_REDIRECT
    let role = "employer";
    if (data.password === "worker123") role = "worker";
    else if (data.password === "admin123") role = "admin";

    return { token, role };
  }

  // VERIFY OTP — any 6 digits accepted
  if (url === "/auth/verify-otp") {
    await delay();
    return { message: "OTP verified successfully" };
  }

  // RESEND OTP
  if (url === "/auth/resend-otp") {
    await delay();
    return { message: "OTP resent successfully" };
  }

  // REGISTER EMPLOYER
  if (url === "/auth/register/employer") {
    await delay(600);
    return { message: "Employer registered. OTP sent.", phone: data.phone };
  }

  // REGISTER WORKER
  if (url === "/auth/register/worker") {
    await delay(600);
    return { message: "Worker registered. Pending admin approval.", phone: data.phone };
  }

  // SEND JOB REQUEST
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

  // RATE WORKER
  if (url.includes("/rate")) {
    await delay();
    return { message: "Rating submitted successfully" };
  }

  await delay();
  return { message: "Success" };
};

// ─── GET ─────────────────────────────────────────────────────────────────────
const get = async (url, config) => {
  const filters = config?.params || {};

  // EMPLOYER SEARCH WORKERS
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

  // ALL JOBS
  if (url === "/jobs") return delay().then(() => mockJobs);

  // SPECIFIC JOB
  if (url.match(/^\/jobs\/[\w]+$/)) {
    const id = url.split("/").pop();
    return delay().then(
      () => mockJobs.find((j) => j._id === id) || mockWorkerJobs.find((j) => j._id === id) || mockJobs[0]
    );
  }

  // EMPLOYER JOBS
  if (url === "/employer/jobs") return delay().then(() => mockJobs);

  // WORKER JOBS
  if (url === "/workers/jobs") return delay().then(() => mockWorkerJobs);

  // NOTIFICATIONS
  if (url === "/notifications") return delay().then(() => mockNotifications);

  // SERVICE TYPES
  if (url === "/service-types") return delay().then(() => mockServiceTypes);

  // ADMIN DASHBOARD
  if (url === "/admin/dashboard") return delay().then(() => mockDashboardMetrics);

  // ADMIN PENDING WORKERS
  if (url === "/admin/workers/pending") return delay().then(() => mockDashboardMetrics.recentWorkers);

  // WORKER PUBLIC PROFILE
  if (url.match(/^\/workers\/[\w]+\/profile$/)) return delay().then(() => mockWorkerProfile);

  // WORKER OWN PROFILE
  if (url === "/workers/profile") return delay().then(() => mockWorkerProfile);

  // MESSAGES
  if (url.match(/^\/messages\/[\w]+$/)) return delay().then(() => mockMessages);

  return delay().then(() => []);
};

// ─── PATCH ───────────────────────────────────────────────────────────────────
const patch = async (url, data) => {
  await delay(300);
  if (url.includes("/cancel"))       return { message: "Job cancelled" };
  if (url.includes("/confirm"))      return { message: "Job confirmed" };
  if (url.includes("/accept"))       return { message: "Job accepted" };
  if (url.includes("/reject"))       return { message: "Job rejected" };
  if (url.includes("/done"))         return { message: "Job marked as done" };
  if (url === "/workers/availability") return { message: "Availability updated" };
  return { message: "Updated successfully" };
};

// ─── PUT / DELETE ─────────────────────────────────────────────────────────────
const put = async (url, data) => { await delay(400); return { message: "Updated" }; };
const del = async (url)        => { await delay(300); return { message: "Deleted" }; };

// ─── MOCK SOCKET (for useChat) ────────────────────────────────────────────────
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
  off(event) {
    this._listeners[event] = [];
  },
};

// ─── DEFAULT EXPORT ───────────────────────────────────────────────────────────
const mockApi = { get, post, patch, put, delete: del };
export default mockApi;