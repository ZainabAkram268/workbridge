import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { HardHat, Briefcase, Network } from "lucide-react";

const ROLE_REDIRECT = {
  admin: "/admin/dashboard",
  worker: "/worker/dashboard",
  employer: "/employer/workers",
};

export default function Login() {
  const [tab, setTab]           = useState("worker");
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  // Phone number validation for Pakistan (+92 format)
  const validatePhone = (value) => {
    // Remove all non-digit characters except leading +
    let cleaned = value.replace(/[^\d+]/g, "");

    // Allow only +92 or 03xx format
    if (cleaned.startsWith("+")) {
      return cleaned.match(/^\+92\d{10}$/) || cleaned === "+";
    } else {
      return cleaned.match(/^03\d{9}$/) || cleaned === "";
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    
    // Allow only numbers and + sign
    const sanitized = value.replace(/[^0-9+]/g, "");

    // Basic length limit (max +92 followed by 10 digits)
    if (sanitized.length > 13) return;

    // Auto-format: if user starts with 0, keep as is (03xx format)
    // if starts with +, convert to international format
    setPhone(sanitized);
    setError(""); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Final validation before API call
    const isValidPhone = phone.match(/^\+92\d{10}$/) || phone.match(/^03\d{9}$/);

    if (!isValidPhone) {
      setError("Please enter a valid Pakistani phone number (e.g., +923001234567 or 03001234567)");
      setLoading(false);
      return;
    }

    try {
      const { token, role } = await api.post("/auth/login", { 
        phone, 
        password, 
        role: tab 
      });

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
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Network className="w-6 h-6 text-teal-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your WorkBridge account</p>
        </div>

        {/* Role tabs */}
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6">
          {[
            { id: "worker",   label: "Worker",   icon: <HardHat   className="w-4 h-4" /> },
            { id: "employer", label: "Employer", icon: <Briefcase className="w-4 h-4" /> },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setTab(r.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 ${
                tab === r.id
                  ? "bg-gray-900 text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+92 300 1234567"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: +923001234567 or 03001234567
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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