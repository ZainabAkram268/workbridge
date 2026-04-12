import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Car, Sparkles, Sprout, Baby, ChefHat,
  MapPin, Star, CheckCircle, XCircle, Search
} from "lucide-react";

const SERVICES = ["All Services", "Cleaner", "Driver", "Babysitter", "Cook", "Gardener"];
const CITIES   = ["All Cities", "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const AREAS    = ["All Areas", "DHA", "Gulberg", "Johar Town", "Bahria Town", "Model Town", "Cantt", "Garden Town"];

const SERVICE_ICON = { Driver: Car, Cleaner: Sparkles, Gardener: Sprout, Babysitter: Baby, Cook: ChefHat };

function initials(name = "") {
  return name.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

const MOCK_WORKERS = [
  { _id:"1", userId:{ fullName:"Ali Mahmood" },   services:["Driver","Cleaner"],      preferredCity:"Lahore", preferredDistrict:"DHA",         averageRating:4.8, totalReviews:23, completedJobs:47, availabilityBadge:"Available" },
  { _id:"2", userId:{ fullName:"Zara Fatima" },   services:["Babysitter","Cook"],      preferredCity:"Lahore", preferredDistrict:"Gulberg",      averageRating:4.9, totalReviews:31, completedJobs:31, availabilityBadge:"Available" },
  { _id:"3", userId:{ fullName:"Nadia Akhtar" },  services:["Cook","Cleaner","Gardener"], preferredCity:"Lahore", preferredDistrict:"Bahria Town", averageRating:5.0, totalReviews:8,  completedJobs:8,  availabilityBadge:"Available" },
  { _id:"4", userId:{ fullName:"Mohammad Khan" }, services:["Gardener"],               preferredCity:"Lahore", preferredDistrict:"Johar Town",   averageRating:4.6, totalReviews:14, completedJobs:14, availabilityBadge:"Busy" },
];

export default function FindWorkers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allWorkers] = useState(MOCK_WORKERS);
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [filters, setFilters] = useState({ service:"", city:"", district:"", availability:"all" });

  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  const applyFilters = () => {
    let result = [...allWorkers];
    const service  = filters.service.toLowerCase();
    const city     = filters.city.toLowerCase();
    const district = filters.district.toLowerCase();
    if (service && service !== "all services")
      result = result.filter(w => w.services.some(s => s.toLowerCase().includes(service)));
    if (city && city !== "all cities")
      result = result.filter(w => w.preferredCity.toLowerCase() === city);
    if (district && district !== "all areas")
      result = result.filter(w => w.preferredDistrict.toLowerCase() === district);
    if (filters.availability !== "all")
      result = result.filter(w =>
        filters.availability === "available"
          ? w.availabilityBadge.toLowerCase() === "available"
          : w.availabilityBadge.toLowerCase() === "busy"
      );
    setWorkers(result);
  };

  const clearFilters = () => {
    setFilters({ service:"", city:"", district:"", availability:"all" });
    setWorkers(allWorkers);
  };

  const handleHire = (workerId) => {
    if (!user) return navigate("/login");
    navigate(`/employer/hire/${workerId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      

      <main className="flex-1 ml-[232px] p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Find Workers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Browse verified workers in your area</p>
        </div>

        <div className="flex gap-6">
          {/* Filters */}
          <aside className="w-56 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-fit sticky top-8">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-5">
              <Search size={15} className="text-teal-600" /> Filters
            </h3>

            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Service</label>
            <select
              value={filters.service}
              onChange={e => setF("service", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>

            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">City</label>
            <select
              value={filters.city}
              onChange={e => setF("city", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Area</label>
            <select
              value={filters.district}
              onChange={e => setF("district", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {AREAS.map(a => <option key={a}>{a}</option>)}
            </select>

            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Availability</label>
            {[
              { v:"all", l:"All Workers" },
              { v:"available", l:"Available" },
              { v:"busy", l:"Busy" },
            ].map(o => (
              <label key={o.v} className="flex items-center gap-2 text-sm text-gray-600 mt-1.5 cursor-pointer">
                <input type="radio" checked={filters.availability === o.v} onChange={() => setF("availability", o.v)} />
                {o.v === "available" && <CheckCircle size={13} className="text-green-500" />}
                {o.v === "busy"      && <XCircle size={13} className="text-red-400" />}
                {o.l}
              </label>
            ))}

            <button onClick={applyFilters} className="w-full mt-5 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Apply
            </button>
            <button onClick={clearFilters} className="w-full mt-2 border border-gray-200 text-sm py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
              Clear
            </button>
          </aside>

          {/* Workers grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-4 font-medium">{workers.length} verified worker{workers.length !== 1 ? "s" : ""} found</p>

            <div className="grid grid-cols-2 gap-4">
              {workers.map(w => {
                const Icon = SERVICE_ICON[w.services[0]];
                const available = w.availabilityBadge === "Available";
                return (
                  <div key={w._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between mb-4">
                      <div className="flex gap-3 items-start">
                        <div className="w-11 h-11 bg-gray-900 text-white flex items-center justify-center rounded-xl text-sm font-bold flex-shrink-0">
                          {initials(w.userId.fullName)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{w.userId.fullName}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            {Icon && <Icon size={12} />} {w.services.join(", ")}
                          </div>
                          <div className="text-xs flex items-center gap-1 mt-1 text-amber-500 font-semibold">
                            <Star size={12} className="fill-amber-400 stroke-amber-400" />
                            {w.averageRating} <span className="text-gray-400 font-normal">({w.totalReviews})</span>
                          </div>
                        </div>
                      </div>

                      <span className={`text-[11px] font-semibold flex items-center gap-1 h-fit px-2 py-1 rounded-full ${
                        available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                      }`}>
                        {available
                          ? <CheckCircle size={11} className="text-green-500" />
                          : <XCircle size={11} className="text-red-400" />}
                        {w.availabilityBadge}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={12} /> {w.preferredDistrict} · {w.completedJobs} jobs
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/employer/workers/${w._id}`}
                          className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 no-underline transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleHire(w._id)}
                          className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Hire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {workers.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <Search size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No workers match your filters</p>
                <button onClick={clearFilters} className="mt-3 text-sm text-teal-600 font-semibold hover:underline">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
