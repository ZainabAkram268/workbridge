import React from "react";

const SERVICES = ["All Services","Domestic Helpers","Drivers","Gardeners","Babysitters","Cooks","Electricians","Plumbers","Security Guards"];
const CITIES   = ["All Cities","Lahore","Karachi","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta"];
const AREAS    = ["All Areas","DHA","Gulberg","Johar Town","Bahria Town","Model Town","Cantt","Garden Town"];

export default function FilterSidebar({ filters, setFilters, onApply, onClear }) {
  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e5e5", padding: "20px", width: "248px", flexShrink: 0, alignSelf: "flex-start" }}>
      <h3 style={{ margin: "0 0 20px", fontWeight: 700, fontSize: "16px" }}>🔍 Filter Workers</h3>

      {[{ label: "Service Type", key: "service", opts: SERVICES, empty: "All Services" },
        { label: "City",         key: "city",    opts: CITIES,   empty: "All Cities"   },
        { label: "District",     key: "district",opts: AREAS,    empty: "All Areas"    },
      ].map(f => (
        <div key={f.key} style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>{f.label}</label>
          <select className="wb-input" value={filters[f.key]}
            onChange={e => set(f.key, e.target.value === f.empty ? "" : e.target.value)}>
            {f.opts.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "10px" }}>Availability</label>
        {[{ v: "all", l: "All Workers" }, { v: "available", l: "🟢 Available Now" }, { v: "busy", l: "🔴 Busy" }].map(o => (
          <label key={o.v} style={{ display: "flex", gap: "8px", alignItems: "center", cursor: "pointer", fontSize: "14px", marginBottom: "8px", fontWeight: filters.availability === o.v ? 600 : 400 }}>
            <input type="radio" name="avail" value={o.v} checked={filters.availability === o.v} onChange={() => set("availability", o.v)} />
            {o.l}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Available Date</label>
        <input className="wb-input" type="date" value={filters.availableDate} onChange={e => set("availableDate", e.target.value)} />
      </div>

      <button onClick={onApply} style={{ width: "100%", padding: "12px", background: "#1e1e1e", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer", marginBottom: "10px" }}>
        Apply Filters
      </button>
      <button onClick={onClear} style={{ width: "100%", padding: "12px", background: "white", color: "#1a1a1a", border: "1.5px solid #1e1e1e", borderRadius: "10px", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
        Clear All
      </button>
    </div>
  );
}