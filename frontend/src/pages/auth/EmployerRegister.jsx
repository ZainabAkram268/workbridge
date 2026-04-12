//EmployerRegister.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function EmployerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "", confirmPassword: "" });
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const otpRefs = React.useRef([]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  React.useEffect(() => {
    if (step !== 1 || resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer, step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      await api.post("/auth/register/employer", {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });
      setResendTimer(60);
      setStep(1);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i, v) => {
    const d = [...otpDigits];
    d[i] = v.slice(-1);
    setOtpDigits(d);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const verifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length < 6) return setError("Enter all 6 digits");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { phone: form.phone, otp });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Access CNIC-verified worker profiles",
    "Search by service, location & availability",
    "Transparent ratings & reviews",
    "Real-time job request management",
    "Direct in-app messaging",
    "Secure & trusted platform",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center bg-gray-900 w-5/12 p-12">
        <h2 className="text-3xl font-extrabold text-white leading-snug mb-5">
          Hire <span className="text-teal">Verified Workers</span> with Confidence
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Join thousands of employers who trust WorkBridge for reliable, verified domestic and service workers.
        </p>
        <ul className="space-y-3">
          {features.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="text-teal font-bold">✓</span>
              <span className="text-gray-300 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {step === 0 ? (
            <>
              <span className="inline-block bg-teal-light text-teal-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Employer Sign Up
              </span>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create Employer Account</h1>
              <p className="text-sm text-gray-500 mb-7">Register in 2 minutes with OTP verification</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                    placeholder="Saqib Aslam"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>{" "}
                    <span className="text-gray-400 font-normal">(WhatsApp)</span>
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                    placeholder="0334-1234567"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                    placeholder="Min 8 chars with special character"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? "Creating account…" : "Create Account & Send OTP"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-5">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-teal-dark hover:underline">
                  Login here
                </Link>
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                Looking for work?{" "}
                <Link to="/register/worker" className="font-semibold text-teal-dark hover:underline">
                  Register as Worker
                </Link>
              </p>
            </>
          ) : (
            /* OTP Step */
            <div className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <span className="inline-block bg-teal-light text-teal-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Verification
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Enter OTP Code</h2>
              <p className="text-sm text-gray-500 mb-7">
                A 6-digit code has been sent to <strong>{form.phone}</strong>
              </p>

              {error && (
                <p className="text-red-600 text-sm mb-4">{error}</p>
              )}

              <div className="flex gap-3 justify-center mb-6">
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    maxLength={1}
                    inputMode="numeric"
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal"
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-4"
              >
                {loading ? "Verifying…" : "Verify & Continue"}
              </button>

              <p className="text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button
                  onClick={() => {}}
                  disabled={resendTimer > 0}
                  className="font-semibold text-teal-dark disabled:opacity-40"
                >
                  Resend OTP
                </button>
                {resendTimer > 0 && (
                  <span className="text-gray-400"> (available in {resendTimer}s)</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}