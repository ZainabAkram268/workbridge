import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import {
  HardHat, Car, Home, Leaf, Baby, ChefHat, Zap, Wrench, Shield,
  Camera, Smartphone, Check, ArrowLeft, ArrowRight,
} from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SERVICES = [
  { id: "cleaner",     icon: <Home      className="w-6 h-6" />, label: "Domestic Helpers" },
  { id: "driver",      icon: <Car       className="w-6 h-6" />, label: "Drivers"           },
  { id: "gardener",    icon: <Leaf      className="w-6 h-6" />, label: "Gardeners"         },
  { id: "babysitter",  icon: <Baby      className="w-6 h-6" />, label: "Babysitters"       },
  { id: "cook",        icon: <ChefHat  className="w-6 h-6" />, label: "Cooks"             },
  { id: "electrician", icon: <Zap       className="w-6 h-6" />, label: "Electricians"     },
  { id: "plumber",     icon: <Wrench    className="w-6 h-6" />, label: "Plumbers"          },
  { id: "security",    icon: <Shield    className="w-6 h-6" />, label: "Security Guards"  },
];
const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const STEPS = ["Personal Info", "Services", "Availability", "Documents", "Verify OTP"];

export default function WorkerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const otpRefs = useRef([]);

  const [form, setForm] = useState({
    fullName: "", fatherSpouseName: "", dateOfBirth: "", gender: "Male",
    cnicNumber: "", phone: "", password: "", confirmPassword: "",
    currentAddress: "", secondaryContact: "", email: "", permanentAddress: "",
    emergencyContact: "", maritalStatus: "",
    services: [], days: [], startTime: "08:00", endTime: "17:00",
    preferredCity: "Lahore", maxTravelDistance: "20",
    cnicFront: null, cnicBack: null,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleArr = (k, v) =>
    setForm((f) => ({
      ...f,
      [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v],
    }));

  useEffect(() => {
    if (step !== 4 || resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer, step]);

  const validateStep = () => {
    setError("");
    if (step === 0) {
      if (!form.fullName.trim()) return setError("Full name is required");
      if (!form.fatherSpouseName.trim()) return setError("Father/Spouse name is required");
      if (!form.dateOfBirth) return setError("Date of birth is required");
      if (!form.cnicNumber.match(/^\d{5}-\d{7}-\d$/)) return setError("CNIC format: 00000-0000000-0");
      if (!form.phone.match(/^03\d{2}-\d{7}$/)) return setError("Phone format: 03XX-XXXXXXX");
      if (!form.currentAddress.trim()) return setError("Current address is required");
      if (!form.password || form.password.length < 8) return setError("Password must be at least 8 characters");
      if (form.password !== form.confirmPassword) return setError("Passwords do not match");
      return true;
    }
    if (step === 1 && form.services.length === 0) return setError("Select at least one service");
    if (step === 2 && form.days.length === 0) return setError("Select at least one available day");
    if (step === 3 && !form.cnicFront) return setError("CNIC front image is required");
    return true;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (step === 3) {
      setLoading(true);
      try {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
          if (v instanceof File) fd.append(k, v);
          else if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
          else if (v !== null && v !== undefined) fd.append(k, v);
        });
        await api.post("/auth/register/worker", fd, { headers: { "Content-Type": "multipart/form-data" } });
        setResendTimer(60);
        setStep(4);
      } catch (err) {
        setError(err.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    } else {
      setStep((s) => s + 1);
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <HardHat className="w-6 h-6 text-teal" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Worker Registration</h1>
          <p className="text-sm text-gray-500 mt-1">Complete all steps to create your profile</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step
                      ? "bg-teal text-white"
                      : i === step
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-[10px] text-gray-500 text-center leading-tight hidden sm:block">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-teal" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Step 0 – Personal Info */}
          {step === 0 && (
            <form onSubmit={handleNext} className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" placeholder="Muhammad Ali" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father/Spouse Name <span className="text-red-500">*</span></label>
                  <input className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" placeholder="Abdul Rehman" value={form.fatherSpouseName} onChange={(e) => set("fatherSpouseName", e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                  <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNIC <span className="text-red-500">*</span></label>
                  <input className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" placeholder="35202-1234567-1" value={form.cnicNumber} onChange={(e) => set("cnicNumber", e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                  <input className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" placeholder="0300-1234567" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Address <span className="text-red-500">*</span></label>
                  <input className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" placeholder="House No., Street, Area, City" value={form.currentAddress} onChange={(e) => set("currentAddress", e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <input type="password" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" placeholder="Min 8 characters" value={form.password} onChange={(e) => set("password", e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                  <input type="password" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" placeholder="Re-enter password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} required />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 py-3 rounded-xl transition-colors flex items-center gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 1 – Services */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Select Your Services</h2>
              <p className="text-sm text-gray-500">Choose all services you can provide</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SERVICES.map((s) => {
                  const selected = form.services.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleArr("services", s.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                        selected
                          ? "border-teal bg-teal-light text-teal-dark"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className={selected ? "text-teal-dark" : "text-gray-400"}>{s.icon}</span>
                      <span className="text-center text-xs leading-tight">{s.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep((s) => s - 1)} className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 py-3 rounded-xl transition-colors flex items-center gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2 – Availability */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Availability & Location</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => {
                    const sel = form.days.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleArr("days", d)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          sel
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input type="time" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input type="time" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred City</label>
                  <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" value={form.preferredCity} onChange={(e) => set("preferredCity", e.target.value)}>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Travel (km)</label>
                  <input type="number" min="1" max="100" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal" value={form.maxTravelDistance} onChange={(e) => set("maxTravelDistance", e.target.value)} />
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep((s) => s - 1)} className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 py-3 rounded-xl transition-colors flex items-center gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3 – Documents */}
          {step === 3 && (
            <form onSubmit={handleNext} className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">CNIC Documents</h2>
              <p className="text-sm text-gray-500">Upload clear photos of your CNIC for verification</p>
              {[
                { key: "cnicFront", label: "CNIC Front Side", required: true },
                { key: "cnicBack",  label: "CNIC Back Side",  required: false },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-teal transition-colors">
                    {form[key] ? (
                      <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        {form[key].name}
                        <button type="button" onClick={() => set(key, null)} className="ml-2 text-red-500 text-xs underline">Remove</button>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <label className="cursor-pointer text-sm text-teal-dark font-semibold hover:underline">
                          Click to upload
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => set(key, e.target.files[0])} />
                        </label>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep((s) => s - 1)} className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" disabled={loading} className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "Submitting…" : "Submit & Get OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Step 4 – OTP */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-teal" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Verify Your Phone</h2>
              <p className="text-sm text-gray-500 mb-7">
                Enter the 6-digit code sent to <strong>{form.phone}</strong>
              </p>
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
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mb-4"
              >
                {loading ? "Verifying…" : "Verify & Create Account"}
              </button>
              <p className="text-sm text-gray-500">
                Didn't receive it?{" "}
                <button onClick={() => {}} disabled={resendTimer > 0} className="font-semibold text-teal-dark disabled:opacity-40">
                  Resend
                </button>
                {resendTimer > 0 && <span className="text-gray-400"> ({resendTimer}s)</span>}
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-teal-dark hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}