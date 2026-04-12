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
  { id: "cook",        icon: <ChefHat   className="w-6 h-6" />, label: "Cooks"             },
  { id: "electrician", icon: <Zap       className="w-6 h-6" />, label: "Electricians"      },
  { id: "plumber",     icon: <Wrench    className="w-6 h-6" />, label: "Plumbers"          },
  { id: "security",    icon: <Shield    className="w-6 h-6" />, label: "Security Guards"   },
];
const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const STEPS  = ["Personal Info", "Services", "Availability", "Documents", "Verify OTP"];

const formatPhone = (v) => {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 4) return digits;
  return digits.slice(0, 4) + "-" + digits.slice(4);
};

const formatCnic = (v) => {
  const digits = v.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return digits.slice(0, 5) + "-" + digits.slice(5);
  return digits.slice(0, 5) + "-" + digits.slice(5, 12) + "-" + digits.slice(12);
};

const blockNonAlpha = (e) => {
  if (
    !/^[a-zA-Z\s]$/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
  ) {
    e.preventDefault();
  }
};

export default function WorkerRegister() {
  const navigate = useNavigate();
  const [step, setStep]               = useState(0);
  const [error, setError]             = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading]         = useState(false);
  const [otpDigits, setOtpDigits]     = useState(["", "", "", "", "", ""]);
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

  const today  = new Date();
  const maxDob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString().split("T")[0];
  const minDob = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate())
    .toISOString().split("T")[0];

  const setField = (k, v) => {
    if (k === "fullName")         v = v.replace(/[^a-zA-Z\s]/g, "").slice(0, 60);
    if (k === "fatherSpouseName") v = v.replace(/[^a-zA-Z\s]/g, "").slice(0, 60);

    if (k === "phone") {
      v = formatPhone(v);
      const digits = v.replace(/\D/g, "");
      if (digits.length >= 2 && !digits.startsWith("03"))
        setFieldErrors((e) => ({ ...e, phone: "Phone must start with 03." }));
      else
        setFieldErrors((e) => ({ ...e, phone: undefined }));
    }
    if (k === "cnicNumber") {
      v = formatCnic(v);
      const digits = v.replace(/\D/g, "");
      if (digits.length >= 5 && !digits.startsWith("35202"))
        setFieldErrors((e) => ({ ...e, cnicNumber: "CNIC must start with 35202." }));
      else
        setFieldErrors((e) => ({ ...e, cnicNumber: undefined }));
    }
    if (k === "password") {
      if (v.length > 0 && v.length < 8)
        setFieldErrors((e) => ({ ...e, password: "Password must be at least 8 characters." }));
      else
        setFieldErrors((e) => ({ ...e, password: undefined }));
    }
    if (k === "confirmPassword") {
  setForm((f) => {
    if (v !== f.password)
      setFieldErrors((e) => ({ ...e, confirmPassword: "Passwords do not match." }));
    else
      setFieldErrors((e) => ({ ...e, confirmPassword: undefined }));
    return f; // don't change form here, just read latest password
  });
}
    if (!["phone", "cnicNumber", "password", "confirmPassword"].includes(k))
      setFieldErrors((e) => ({ ...e, [k]: undefined }));

    setForm((f) => ({ ...f, [k]: v }));
  };

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
    const errs = {};

    if (step === 0) {
      if (!form.fullName.trim())
        errs.fullName = "Full name is required.";
      else if (form.fullName.trim().length < 3)
        errs.fullName = "Name must be at least 3 characters.";

      if (!form.fatherSpouseName.trim())
        errs.fatherSpouseName = "Father/Spouse name is required.";
      else if (form.fatherSpouseName.trim().length < 3)
        errs.fatherSpouseName = "Name must be at least 3 characters.";

      if (!form.dateOfBirth)
        errs.dateOfBirth = "Date of birth is required.";
      else if (form.dateOfBirth > maxDob)
        errs.dateOfBirth = "Worker must be at least 18 years old.";
      else if (form.dateOfBirth < minDob)
        errs.dateOfBirth = "Please enter a valid date of birth.";

      if (!form.cnicNumber.trim())
        errs.cnicNumber = "CNIC is required.";
      else if (!/^35202-[0-9]{7}-[0-9]$/.test(form.cnicNumber.trim()))
        errs.cnicNumber = "CNIC must follow format: 35202-XXXXXXX-X.";

      if (!form.phone.trim())
        errs.phone = "Phone is required.";
      else if (!/^03[0-9]{2}-[0-9]{7}$/.test(form.phone.trim()))
        errs.phone = "Enter valid format: 03XX-XXXXXXX.";

      if (!form.currentAddress.trim())
        errs.currentAddress = "Current address is required.";
      else if (!/[a-zA-Z]/.test(form.currentAddress))
        errs.currentAddress = "Address must contain letters, not just numbers.";

      if (!form.password || form.password.length < 8)
        errs.password = "Password must be at least 8 characters.";

      if (form.password !== form.confirmPassword)
        errs.confirmPassword = "Passwords do not match.";

      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        return false;
      }
    }

    if (step === 1 && form.services.length === 0) {
      setError("Please select at least one service.");
      return false;
    }
    if (step === 2 && form.days.length === 0) {
      setError("Please select at least one available day.");
      return false;
    }
    if (step === 3 && !form.cnicFront) {
      setError("CNIC front image is required.");
      return false;
    }
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

  const inputClass = (key) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
      fieldErrors[key]
        ? "border-red-400 focus:ring-red-300 bg-red-50"
        : "border-gray-300 focus:ring-teal-400"
    }`;

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
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? "bg-teal text-white" : i === step ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"
                }`}>
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
                  <input
                    className={inputClass("fullName")}
                    placeholder="Muhammad Ali"
                    value={form.fullName}
                    onKeyDown={blockNonAlpha}
                    onChange={(e) => setField("fullName", e.target.value)}
                  />
                  {fieldErrors.fullName
                    ? <p className="text-xs text-red-500 mt-1">{fieldErrors.fullName}</p>
                    : <p className="text-xs text-gray-400 mt-1">Letters only</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father/Spouse Name <span className="text-red-500">*</span></label>
                  <input
                    className={inputClass("fatherSpouseName")}
                    placeholder="Abdul Rehman"
                    value={form.fatherSpouseName}
                    onKeyDown={blockNonAlpha}
                    onChange={(e) => setField("fatherSpouseName", e.target.value)}
                  />
                  {fieldErrors.fatherSpouseName
                    ? <p className="text-xs text-red-500 mt-1">{fieldErrors.fatherSpouseName}</p>
                    : <p className="text-xs text-gray-400 mt-1">Letters only</p>}
                </div>

                {/* ── Date of Birth – blocks manual invalid year entry ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    className={inputClass("dateOfBirth")}
                    value={form.dateOfBirth}
                    min={minDob}
                    max={maxDob}
                    onKeyDown={(e) => {
                      // Allow only navigation keys; block all manual typing to prevent invalid years
                      if (![
                        "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
                        "Delete", "Backspace", "F1", "F2", "F3", "F4", "F5"
                      ].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) { setField("dateOfBirth", ""); return; }
                      // Extra guard: reject year outside plausible range as user types
                      const year = parseInt(val.split("-")[0], 10);
                      if (year > today.getFullYear()) return;
                      setField("dateOfBirth", val);
                    }}
                  />
                  {fieldErrors.dateOfBirth
                    ? <p className="text-xs text-red-500 mt-1">{fieldErrors.dateOfBirth}</p>
                    : <p className="text-xs text-gray-400 mt-1">Must be 18 years or older</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                  <select className={inputClass("gender")} value={form.gender} onChange={(e) => setField("gender", e.target.value)}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNIC <span className="text-red-500">*</span></label>
                  <input
                    className={inputClass("cnicNumber")}
                    placeholder="35202-XXXXXXX-X"
                    value={form.cnicNumber}
                    onChange={(e) => setField("cnicNumber", e.target.value)}
                  />
                  {fieldErrors.cnicNumber
                    ? <p className="text-xs text-red-500 mt-1">{fieldErrors.cnicNumber}</p>
                    : <p className="text-xs text-gray-400 mt-1">e.g. 35202-1234567-8</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                  <input
                    className={inputClass("phone")}
                    placeholder="03XX-XXXXXXX"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                  />
                  {fieldErrors.phone
                    ? <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
                    : <p className="text-xs text-gray-400 mt-1">e.g. 0309-1234567</p>}
                </div>

                {/* ── Current Address – must contain at least one letter ── */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Address <span className="text-red-500">*</span></label>
                  <input
                    className={inputClass("currentAddress")}
                    placeholder="House No., Street, Area, City"
                    value={form.currentAddress}
                    onKeyDown={(e) => {
                      // Block leading symbols that make no sense in an address
                      if (["+", "=", "*", "#", "@", "!", "$", "%", "^", "&", "(", ")", "_"].includes(e.key))
                        e.preventDefault();
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Reject value if it contains zero letters (pure digits/symbols)
                      if (val.length > 0 && !/[a-zA-Z]/.test(val)) return;
                      setField("currentAddress", val);
                    }}
                  />
                  {fieldErrors.currentAddress
                    ? <p className="text-xs text-red-500 mt-1">{fieldErrors.currentAddress}</p>
                    : <p className="text-xs text-gray-400 mt-1">e.g. House 5, Street 3, Lahore</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    className={inputClass("password")}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                  />
                  {fieldErrors.password
                    ? <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                    : <p className="text-xs text-gray-400 mt-1">At least 8 characters</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    className={inputClass("confirmPassword")}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={(e) => setField("confirmPassword", e.target.value)}
                  />
                  {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
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
                    <button key={s.id} type="button" onClick={() => toggleArr("services", s.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                        selected ? "border-teal bg-teal-light text-teal-dark" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
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
                      <button key={d} type="button" onClick={() => toggleArr("days", d)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          sel ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                      >{d}</button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input type="time" className={inputClass("startTime")} value={form.startTime} onChange={(e) => setField("startTime", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input type="time" className={inputClass("endTime")} value={form.endTime} onChange={(e) => setField("endTime", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred City</label>
                  <select className={inputClass("preferredCity")} value={form.preferredCity} onChange={(e) => setField("preferredCity", e.target.value)}>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Travel (km)</label>
                  <input type="number" min="1" max="100" className={inputClass("maxTravelDistance")} value={form.maxTravelDistance} onChange={(e) => setField("maxTravelDistance", e.target.value)} />
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
                { key: "cnicFront", label: "CNIC Front Side", required: true  },
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
                        <button type="button" onClick={() => setField(key, null)} className="ml-2 text-red-500 text-xs underline">Remove</button>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <label className="cursor-pointer text-sm text-teal-dark font-semibold hover:underline">
                          Click to upload
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => setField(key, e.target.files[0])} />
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
              <button onClick={verifyOtp} disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mb-4">
                {loading ? "Verifying…" : "Verify & Create Account"}
              </button>
              <p className="text-sm text-gray-500">
                Didn't receive it?{" "}
                <button onClick={() => {}} disabled={resendTimer > 0} className="font-semibold text-teal-dark disabled:opacity-40">Resend</button>
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