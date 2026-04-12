import React, { useState, useEffect } from "react";
import {
  Car, Home, Leaf, MapPin, Star, User, Baby,
  UtensilsCrossed, Zap, Droplets,
  ShieldCheck, CheckCircle2, Briefcase, DollarSign, Clock, RotateCcw, ChevronRight, AlertCircle
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SERVICES_LIST = [
  { id: "Drivers", icon: Car },
  { id: "Domestic Helpers", icon: Home },
  { id: "Gardeners", icon: Leaf },
  { id: "Babysitters", icon: Baby },
  { id: "Cooks", icon: UtensilsCrossed },
  { id: "Electricians", icon: Zap },
  { id: "Plumbers", icon: Droplets },
  { id: "Security Guards", icon: ShieldCheck }
];

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

// ─── Validators ───────────────────────────────────────────────────────────────
function validate(form) {
  const errors = {};

  const name = form.userId?.fullName?.trim() || "";
  if (!name) errors.fullName = "Full name is required.";
  else if (name.length < 3) errors.fullName = "Name must be at least 3 characters.";

  const phone = (form.phone || "").trim();
  if (!phone) errors.phone = "WhatsApp number is required.";
  else if (!/^(\+92|0)?3[0-9]{9}$/.test(phone.replace(/\s/g, "")))
    errors.phone = "Enter a valid Pakistani number (e.g. 03001234567).";

  const address = (form.currentAddress || "").trim();
  if (!address) errors.currentAddress = "Address is required.";
  else if (address.length < 10) errors.currentAddress = "Please enter a more complete address.";

  if (!form.preferredCity) errors.preferredCity = "Please select a city.";

  const hourly = Number(form.hourlyRate);
  const daily  = Number(form.dailyRate);
  const monthly= Number(form.monthlyRate);

  if (form.hourlyRate !== "" && form.hourlyRate !== undefined) {
    if (isNaN(hourly) || hourly < 0) errors.hourlyRate = "Must be a positive number.";
    else if (hourly > 10000) errors.hourlyRate = "Hourly rate seems too high (max 10,000 PKR).";
  }
  if (form.dailyRate !== "" && form.dailyRate !== undefined) {
    if (isNaN(daily) || daily < 0) errors.dailyRate = "Must be a positive number.";
    else if (daily > 100000) errors.dailyRate = "Daily rate seems too high (max 100,000 PKR).";
  }
  if (form.monthlyRate !== "" && form.monthlyRate !== undefined) {
    if (isNaN(monthly) || monthly < 0) errors.monthlyRate = "Must be a positive number.";
    else if (monthly > 500000) errors.monthlyRate = "Monthly rate seems too high (max 500,000 PKR).";
  }

  if (!form.services || form.services.length === 0)
    errors.services = "Select at least one service.";

  if (!form.days || form.days.length === 0)
    errors.days = "Select at least one working day.";

  if (form.startTime && form.endTime && form.startTime >= form.endTime)
    errors.endTime = "End time must be after start time.";

  return errors;
}

// ─── Field-level error component ─────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5 ml-1">
      <AlertCircle className="w-3 h-3 shrink-0" /> {msg}
    </p>
  );
}

// ─── Input class helper ───────────────────────────────────────────────────────
function inputCls(hasError) {
  return `w-full bg-white border rounded-xl px-4 py-3 text-sm focus:ring-4 outline-none transition-all
    ${hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
      : "border-slate-300 focus:border-teal-500 focus:ring-teal-500/10 hover:border-slate-400"
    }`;
}

export default function WorkerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/workers/me")
      .then(d => { if (d) { setProfile(d); setForm(d); } })
      .catch(() => {});
  }, []);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setTouched(t => ({ ...t, [k]: true }));
    // Clear error on change
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const touch = (k) => setTouched(t => ({ ...t, [k]: true }));

  const toggleService = (s) => {
    setForm(f => ({
      ...f,
      services: f.services?.includes(s)
        ? f.services.filter(x => x !== s)
        : [...(f.services || []), s]
    }));
    setErrors(e => ({ ...e, services: undefined }));
  };

  const toggleDay = (d) => {
    setForm(f => ({
      ...f,
      days: f.days?.includes(d)
        ? f.days.filter(x => x !== d)
        : [...(f.days || []), d]
    }));
    setErrors(e => ({ ...e, days: undefined }));
  };

  const handleSave = async () => {
    // Validate everything on submit
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Mark all fields as touched so errors show
      const allTouched = Object.keys(errs).reduce((a, k) => ({ ...a, [k]: true }), {});
      setTouched(t => ({ ...t, ...allTouched }));
      return;
    }

    setLoading(true);
    try {
      await api.put("/workers/me", form);
      setSaved(true);
      setProfile(form);
      setErrors({});
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (n = "") => n.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();

  // Show error only if field has been touched
  const err = (k) => touched[k] ? errors[k] : undefined;

  return (
    <div className="w-full p-4 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 font-sans antialiased text-slate-800">

      {/* Left: Sticky Profile Summary */}
      <div className="lg:col-span-4 w-full">
        <div className="bg-white rounded-2xl border border-slate-300 p-8 shadow-sm sticky top-10 text-center">
          <div className="w-24 h-24 rounded-2xl bg-teal-500/10 mx-auto mb-6 flex items-center justify-center text-teal-600 text-2xl font-semibold shadow-inner">
            {getInitials(profile.userId?.fullName || user?.fullName)}
          </div>

          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            {profile.userId?.fullName || "Worker Name"}
          </h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {profile.preferredCity || "Not Set"}
          </p>

          <div className="flex flex-col items-center gap-2 mt-6">
            <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
              ● {profile.availabilityBadge || "Available"}
            </div>
            {profile.cnicVerified && (
              <div className="flex items-center gap-1 text-blue-600 text-[11px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" /> CNIC Verified
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-200">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</p>
              <div className="flex items-center justify-center gap-1 text-lg font-semibold text-slate-900">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {profile.averageRating || "0.0"}
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jobs Done</p>
              <p className="text-lg font-semibold text-slate-900">{profile.completedJobs || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Edit Form */}
      <div className="lg:col-span-8 space-y-8 min-w-0">
        {saved && (
          <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-medium">Changes saved successfully</span>
          </div>
        )}

        {/* Global validation summary — only shown on submit attempt */}
        {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">Please fix the errors below before saving.</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-300 p-10 shadow-sm">
          <header className="mb-10">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Profile Settings</h1>
            <p className="text-slate-500 text-sm mt-1">Configure your professional profile and availability.</p>
          </header>

          {/* Personal Info */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <User className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[13px] font-semibold text-slate-600 ml-1">Full Name <span className="text-red-400">*</span></label>
                <input
                  className={inputCls(!!err("fullName"))}
                  placeholder="e.g. Ahmed Khan"
                  value={form.userId?.fullName || ""}
                  onBlur={() => touch("fullName")}
                  onChange={e => {
                    setForm(f => ({ ...f, userId: { ...f.userId, fullName: e.target.value } }));
                    setTouched(t => ({ ...t, fullName: true }));
                    setErrors(er => ({ ...er, fullName: undefined }));
                  }}
                />
                <FieldError msg={err("fullName")} />
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-semibold text-slate-600 ml-1">WhatsApp Number <span className="text-red-400">*</span></label>
                <input
                  className={inputCls(!!err("phone"))}
                  placeholder="e.g. 03001234567"
                  maxLength={13}
                  value={form.phone || ""}
                  onBlur={() => touch("phone")}
                  onChange={e => {
                    // Only allow digits, +, spaces
                    const v = e.target.value.replace(/[^\d+\s]/g, "");
                    set("phone", v);
                  }}
                />
                <FieldError msg={err("phone")} />
              </div>

              <div className="space-y-1 col-span-1 md:col-span-2">
                <label className="text-[13px] font-semibold text-slate-600 ml-1">Current Address <span className="text-red-400">*</span></label>
                <input
                  className={inputCls(!!err("currentAddress"))}
                  placeholder="e.g. House 12, Street 5, Gulberg III, Lahore"
                  value={form.currentAddress || ""}
                  onBlur={() => touch("currentAddress")}
                  onChange={e => set("currentAddress", e.target.value)}
                />
                <FieldError msg={err("currentAddress")} />
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-semibold text-slate-600 ml-1">Preferred City <span className="text-red-400">*</span></label>
                <select
                  className={inputCls(!!err("preferredCity")) + " appearance-none"}
                  value={form.preferredCity || ""}
                  onBlur={() => touch("preferredCity")}
                  onChange={e => set("preferredCity", e.target.value)}
                >
                  <option value="">Select a city...</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <FieldError msg={err("preferredCity")} />
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-semibold text-slate-600 ml-1">Max Travel Distance</label>
                <select
                  className={inputCls(false) + " appearance-none"}
                  value={form.maxTravelDistance || ""}
                  onChange={e => set("maxTravelDistance", e.target.value)}
                >
                  {[5, 10, 20, 30, 50].map(d => <option key={d} value={d}>{d} km</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Services Offered <span className="text-red-400">*</span></h3>
            </div>
            <FieldError msg={err("services")} />
            <div className="flex flex-wrap gap-3 mt-4">
              {SERVICES_LIST.map(s => {
                const Icon = s.icon;
                const isActive = form.services?.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggleService(s.id)} type="button"
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border transition-all text-sm font-medium
                      ${isActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-md"
                        : "bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                      }`}>
                    <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} strokeWidth={2} />
                    {s.id}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <DollarSign className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Pricing Strategy</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Hourly", key: "hourlyRate", sub: "per hour", max: 10000 },
                { label: "Daily",  key: "dailyRate",  sub: "per day",  max: 100000 },
                { label: "Monthly",key: "monthlyRate",sub: "per month",max: 500000 }
              ].map(item => (
                <div key={item.key}
                  className={`border rounded-2xl p-6 transition-all group
                    ${err(item.key)
                      ? "border-red-300 bg-red-50/30"
                      : "bg-slate-50/50 border-slate-300 hover:bg-white hover:border-teal-400/50"
                    }`}>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{item.label}</p>
                  <div className="flex items-baseline">
                    <span className="text-slate-400 text-xs font-medium mr-1">PKR</span>
                    <input
                      type="number"
                      min="0"
                      max={item.max}
                      className="bg-transparent border-none text-xl font-semibold text-slate-900 w-full focus:ring-0 p-0 outline-none"
                      placeholder="0"
                      value={form[item.key] || ""}
                      onBlur={() => touch(item.key)}
                      onChange={e => {
                        const v = e.target.value;
                        // Block negative
                        if (v === "" || Number(v) >= 0) set(item.key, v === "" ? "" : Number(v));
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{item.sub}</p>
                  {err(item.key) && <p className="text-[11px] text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{err(item.key)}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Availability */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Work Schedule <span className="text-red-400">*</span></h3>
            </div>
            <FieldError msg={err("days")} />
            <div className="flex gap-2 mb-8 mt-4 bg-slate-100 p-1.5 rounded-xl w-fit border border-slate-300">
              {DAYS.map(d => {
                const isActive = form.days?.includes(d);
                return (
                  <button key={d} onClick={() => toggleDay(d)} type="button"
                    className={`w-11 h-11 rounded-lg text-xs font-bold transition-all
                      ${isActive
                        ? "bg-white text-teal-600 shadow-sm border border-slate-300"
                        : "text-slate-500 hover:text-slate-700"
                      }`}>
                    {d}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[13px] font-semibold text-slate-600">Shift Start</label>
                <input type="time"
                  className={inputCls(false)}
                  value={form.startTime || ""}
                  onChange={e => set("startTime", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[13px] font-semibold text-slate-600">Shift End</label>
                <input type="time"
                  className={inputCls(!!err("endTime"))}
                  value={form.endTime || ""}
                  onBlur={() => touch("endTime")}
                  onChange={e => set("endTime", e.target.value)} />
                <FieldError msg={err("endTime")} />
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end items-center gap-6 pt-4">
          <button type="button" onClick={() => { setForm(profile); setErrors({}); setTouched({}); }}
            className="text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Discard Changes
          </button>
          <button onClick={handleSave} disabled={loading} type="button"
            className="px-10 py-3.5 bg-slate-900 text-white rounded-xl font-medium text-sm shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50">
            {loading ? "Saving..." : (<>Save Profile <ChevronRight className="w-4 h-4" /></>)}
          </button>
        </div>
      </div>
    </div>
  );
}