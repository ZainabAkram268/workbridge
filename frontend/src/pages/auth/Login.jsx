//Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

const ROLE_REDIRECT = {
  admin: "/admin/dashboard",
  worker: "/worker/dashboard",
  employer: "employer/dashboard"
};

export default function Login() {
  const [tab, setTab]         = useState("worker");
  const [phone, setPhone]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, role } = await api.post("/auth/login", { phone, password, role: tab });
      login(token);
      navigate(ROLE_REDIRECT[role] || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Logo */}
        <div className="text-center mb-7">
          <div className="text-4xl mb-2">🌉</div>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your WorkBridge account</p>
        </div>

        {/* Role tabs */}
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6">
          {[
            { id: "worker",   label: "👷 Worker"   },
            { id: "employer", label: "👨‍💼 Employer" },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setTab(r.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                tab === r.id
                  ? "bg-gray-900 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 1234567"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to={tab === "worker" ? "/register/worker" : "/register/employer"}
            className="font-semibold text-gray-900 hover:underline"
          >
            Register as {tab === "worker" ? "Worker" : "Employer"}
          </Link>
        </p>

        {/* Admin hint */}
        <p className="text-center text-xs text-gray-400 mt-3">
          Admin?{" "}
          <button
            type="button"
            onClick={() => {
              setPhone("+923009999999");
              setPassword("admin123");
            }}
            className="underline hover:text-gray-600"
          >
            Use admin credentials
          </button>
        </p>
      </div>
    </div>
  );
}