import React, { useState, useEffect } from "react";
import { 
  Car, Home, Leaf, MapPin, Star, User, Baby, 
  UtensilsCrossed, Zap, Droplets, 
  ShieldCheck, CheckCircle2, Briefcase, DollarSign, Clock, RotateCcw, ChevronRight
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

export default function WorkerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/workers/me")
      .then(d => { if(d) { setProfile(d); setForm(d); } })
      .catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleService = (s) => setForm(f => ({ ...f, services: f.services?.includes(s) ? f.services.filter(x => x !== s) : [...(f.services || []), s] }));
  const toggleDay = (d) => setForm(f => ({ ...f, days: f.days?.includes(d) ? f.days.filter(x => x !== d) : [...(f.days || []), d] }));

  const handleSave = async () => {
    setLoading(true);
    try { 
      await api.put("/workers/me", form); 
      setSaved(true); 
      setProfile(form); 
      setTimeout(() => setSaved(false), 3000); 
    } catch (err) {
      console.error("Save failed", err);
    } finally { setLoading(false); }
  };

  const getInitials = (n = "") => n.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();

  return (
    <div className="w-full p-4 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 font-sans antialiased text-slate-800">
        
        {/* Left: Elegant Sticky Profile Summary */}
        <div className="lg:col-span-4 w-full">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm sticky top-10 text-center">
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
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold uppercase tracking-wider border border-emerald-100">
                ● {profile.availabilityBadge || "Available"}
              </div>
              {profile.cnicVerified && (
                <div className="flex items-center gap-1 text-blue-600 text-[11px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CNIC Verified
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50">
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

        {/* Right: Refined Edit Form */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
          {saved && (
            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-medium">Changes saved successfully</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm">
            <header className="mb-10">
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Profile Settings</h1>
              <p className="text-slate-400 text-sm mt-1">Configure your professional profile and availability.</p>
            </header>

            {/* Personal Info */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <User className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-600 ml-1">Full Name</label>
                  <input className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all" 
                    value={form.userId?.fullName || ""} onChange={e => setForm({ ...form, userId: { ...form.userId, fullName: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-600 ml-1">WhatsApp Number</label>
                  <input className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all" 
                    value={form.phone || ""} onChange={e => set("phone", e.target.value)} />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-[13px] font-medium text-slate-600 ml-1">Current Address</label>
                  <input className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all" 
                    value={form.currentAddress || ""} onChange={e => set("currentAddress", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-600 ml-1">Preferred City</label>
                  <select className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white outline-none focus:border-teal-500 transition-all appearance-none" 
                    value={form.preferredCity} onChange={e => set("preferredCity", e.target.value)}>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-600 ml-1">Max Travel Distance</label>
                  <select className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white outline-none focus:border-teal-500 transition-all appearance-none" 
                    value={form.maxTravelDistance} onChange={e => set("maxTravelDistance", e.target.value)}>
                    {[5, 10, 20, 30, 50].map(d => <option key={d} value={d}>{d} km</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Services */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Services Offered</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {SERVICES_LIST.map(s => {
                  const Icon = s.icon;
                  const isActive = form.services?.includes(s.id);
                  return (
                    <button key={s.id} onClick={() => toggleService(s.id)} type="button"
                      className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border transition-all text-sm font-medium
                        ${isActive ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}>
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
                  { label: "Hourly", key: "hourlyRate", sub: "per hour" },
                  { label: "Daily", key: "dailyRate", sub: "per day" },
                  { label: "Monthly", key: "monthlyRate", sub: "per month" }
                ].map(item => (
                  <div key={item.key} className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 transition-all hover:bg-white hover:border-teal-500/30 group">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{item.label}</p>
                    <div className="flex items-baseline">
                      <span className="text-slate-400 text-xs font-medium mr-1">PKR</span>
                      <input type="number" className="bg-transparent border-none text-xl font-semibold text-slate-900 w-full focus:ring-0 p-0"
                        value={form[item.key] || ""} onChange={e => set(item.key, Number(e.target.value))} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{item.sub}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Availability */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Clock className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Work Schedule</h3>
              </div>
              <div className="flex gap-2 mb-8 bg-slate-50 p-1.5 rounded-xl w-fit border border-slate-200">
                {DAYS.map(d => {
                  const isActive = form.days?.includes(d);
                  return (
                    <button key={d} onClick={() => toggleDay(d)} type="button"
                      className={`w-11 h-11 rounded-lg text-xs font-bold transition-all
                        ${isActive ? "bg-white text-teal-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}>
                      {d}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-600">Shift Start</label>
                  <input type="time" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white outline-none focus:border-teal-500 transition-all"
                    value={form.startTime || ""} onChange={e => set("startTime", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-600">Shift End</label>
                  <input type="time" className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white outline-none focus:border-teal-500 transition-all"
                    value={form.endTime || ""} onChange={e => set("endTime", e.target.value)} />
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end items-center gap-6 pt-4">
            <button type="button" onClick={() => setForm(profile)} className="text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Discard Changes
            </button>
            <button onClick={handleSave} disabled={loading} type="button"
              className="px-10 py-3.5 bg-slate-900 text-white rounded-xl font-medium text-sm shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50">
              {loading ? "Saving..." : (
                <>
                  Save Profile <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
    </div>
  );
}