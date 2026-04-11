import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

function initials(n="") { return n.split(" ").slice(0,2).map(p=>p[0]).join("").toUpperCase(); }

const MOCK_METRICS = { totalWorkers:284, totalEmployers:631, activeWorkers:241, pendingVerifications:8, jobStats:{ today:{ Requested:14, Accepted:9, "In Progress":6, Completed:31, Rejected:3 } } };
const MOCK_PENDING = [
  { _id:"w1", userId:{fullName:"Rizwan Ahmed"}, services:["Drivers","Gardeners"], submittedAt:"2025-03-12", daysWaiting:2, phone:"0301-2345678", preferredCity:"Lahore" },
  { _id:"w2", userId:{fullName:"Amna Bibi"},    services:["Domestic Helpers","Cooks"], submittedAt:"2025-03-13", daysWaiting:1, phone:"0321-9876543", preferredCity:"Karachi" },
  { _id:"w3", userId:{fullName:"Tariq Mehmood"},services:["Plumbers"], submittedAt:"2025-03-14", daysWaiting:0, phone:"0333-1234567", preferredCity:"Islamabad" },
];
const SERVICE_EMOJI = { Drivers:"🚗","Domestic Helpers":"🧹",Gardeners:"🌱",Babysitters:"👶",Cooks:"👨‍🍳",Electricians:"⚡",Plumbers:"🔧","Security Guards":"🛡️" };
const STATUS_COLOR  = { Requested:"#fef9c3",Accepted:"#dcfce7","In Progress":"#dbeafe",Completed:"#d1fae5",Rejected:"#fee2e2" };

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [metrics, setMetrics]   = useState(MOCK_METRICS);
  const [pending, setPending]   = useState(MOCK_PENDING);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewing, setReviewing] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectId, setRejectId] = useState(null);
  const [periodFilter, setPeriodFilter] = useState("today");
  const [createWorker, setCreateWorker] = useState(false);
  const [newWorkerForm, setNewWorkerForm] = useState({ fullName:"", phone:"", cnicNumber:"", services:[], preferredCity:"Lahore" });

  useEffect(() => {
    api.get("/admin/dashboard").then(d=>{ if(d?.totalWorkers) setMetrics(d); }).catch(()=>{});
    api.get("/admin/workers/pending").then(d=>{ if(d?.length) setPending(d); }).catch(()=>{});
  }, []);

  const approve = async (id) => {
    try { await api.patch(`/admin/workers/${id}/approve`); } catch {}
    setPending(ps => ps.filter(p => p._id !== id));
    setReviewing(null);
  };

  const reject = async () => {
    if (rejectReason.length < 20) return alert("Rejection reason must be at least 20 characters");
    try { await api.patch(`/admin/workers/${rejectId}/reject`, { reason:rejectReason }); } catch {}
    setPending(ps => ps.filter(p => p._id !== rejectId));
    setRejectId(null); setRejectReason(""); setReviewing(null);
  };

  const METRIC_CARDS = [
    { label:"Total Workers",   value:metrics.totalWorkers,   icon:"👷", color:"#dbeafe", textColor:"#1e40af" },
    { label:"Total Employers", value:metrics.totalEmployers,  icon:"👔", color:"#fef9c3", textColor:"#92400e" },
    { label:"Active Workers",  value:metrics.activeWorkers,   icon:"✅", color:"#dcfce7", textColor:"#166534" },
    { label:"Pending Review",  value:metrics.pendingVerifications, icon:"⏳", color:"#ffedd5", textColor:"#9a3412" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#f5f5f5", display:"flex" }}>
      {/* Sidebar */}
      <div className="wb-sidebar">
        <div style={{ padding:"20px", marginBottom:"8px" }}>
          <div className="wb-nav-logo">Work<span style={{color:"#2a9d8f"}}>Bridge</span></div>
          <div style={{ fontSize:"11px", color:"#9ca3af", marginTop:"4px", fontWeight:600 }}>ADMIN PANEL</div>
        </div>
        {[
          { label:"Overview",   icon:"📊", id:"overview" },
          { label:"Verify Workers",icon:"🛡️",id:"verify" },
          { label:"All Workers", icon:"👷", id:"workers" },
          { label:"Job Stats",  icon:"💼", id:"jobs" },
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`wb-sidebar-link ${activeTab===item.id?"active":""}`}>
            <span>{item.icon}</span><span>{item.label}</span>
          </button>
        ))}
        <div style={{ flex:1 }} />
        <button onClick={logout} className="wb-sidebar-link" style={{ color:"#ef4444", border:"none", cursor:"pointer" }}>
          <span>🚪</span><span>Logout</span>
        </button>
      </div>

      {/* Main */}
      <div style={{ flex:1, marginLeft:"232px", padding:"32px" }}>
        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"28px" }}>
              <div>
                <h1 style={{ margin:0, fontSize:"24px", fontWeight:800 }}>Admin Dashboard</h1>
                <p style={{ margin:"4px 0 0", color:"#6b7280", fontSize:"14px" }}>Platform overview and key metrics</p>
              </div>
              <button onClick={() => setCreateWorker(true)} className="wb-btn wb-btn-dark wb-btn-sm">+ Create Worker Account</button>
            </div>

            {/* Metric cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"28px" }}>
              {METRIC_CARDS.map(c => (
                <div key={c.label} style={{ background:"white", borderRadius:"14px", border:"1px solid #e5e5e5", padding:"20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontSize:"13px", color:"#6b7280", marginBottom:"8px" }}>{c.label}</div>
                      <div style={{ fontSize:"32px", fontWeight:900 }}>{c.value ?? 0}</div>
                    </div>
                    <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:c.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>{c.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Job stats */}
            <div className="wb-card" style={{ marginBottom:"24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
                <h2 style={{ margin:0, fontSize:"17px", fontWeight:700 }}>Job Statistics</h2>
                <div style={{ display:"flex", gap:"6px" }}>
                  {["today","week","month"].map(p => (
                    <button key={p} onClick={() => setPeriodFilter(p)} style={{ padding:"6px 14px", borderRadius:"999px", border:"1.5px solid", fontSize:"12px", fontWeight:600, cursor:"pointer", background:periodFilter===p?"#1e1e1e":"white", color:periodFilter===p?"white":"#6b7280", borderColor:periodFilter===p?"#1e1e1e":"#e5e5e5" }}>
                      {p.charAt(0).toUpperCase()+p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"12px" }}>
                {Object.entries(metrics.jobStats?.today||{}).map(([k,v]) => (
                  <div key={k} style={{ background:STATUS_COLOR[k]||"#f5f5f5", borderRadius:"10px", padding:"16px", textAlign:"center" }}>
                    <div style={{ fontSize:"28px", fontWeight:800, marginBottom:"4px" }}>{v}</div>
                    <div style={{ fontSize:"12px", fontWeight:600, color:"#374151" }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick pending */}
            {pending.length > 0 && (
              <div className="wb-card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                  <h2 style={{ margin:0, fontSize:"17px", fontWeight:700 }}>Pending Verification ({pending.length})</h2>
                  <button onClick={() => setActiveTab("verify")} style={{ background:"none", border:"none", color:"#2a9d8f", fontSize:"14px", fontWeight:600, cursor:"pointer" }}>View All →</button>
                </div>
                {pending.slice(0,3).map((w,i) => (
                  <div key={w._id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:i<2?"1px solid #f0f0f0":"none" }}>
                    <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                      <div className="wb-avatar wb-avatar-sm">{initials(w.userId?.fullName)}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:"14px" }}>{w.userId?.fullName}</div>
                        <div style={{ fontSize:"12px", color:"#6b7280" }}>Submitted {w.submittedAt} · {w.daysWaiting}d waiting</div>
                      </div>
                    </div>
                    <button onClick={() => setReviewing(w)} className="wb-btn wb-btn-dark wb-btn-sm">Review</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── VERIFY WORKERS ── */}
        {activeTab === "verify" && (
          <>
            <h1 style={{ margin:"0 0 8px", fontSize:"24px", fontWeight:800 }}>Pending Verification Queue</h1>
            <p style={{ margin:"0 0 24px", color:"#6b7280", fontSize:"14px" }}>Sorted by submission date, oldest first. Must review within 48 business hours.</p>

            <div className="wb-card" style={{ padding:0, overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr", padding:"14px 20px", background:"#f9fafb", borderBottom:"1px solid #e5e5e5", fontSize:"12px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                <div>Worker Name</div><div>Services</div><div>City</div><div>Waiting</div><div>Action</div>
              </div>

              {pending.length === 0 && (
                <div style={{ textAlign:"center", padding:"48px", color:"#9ca3af" }}>
                  <div style={{ fontSize:"40px", marginBottom:"12px" }}>✅</div>
                  <p>All profiles have been reviewed!</p>
                </div>
              )}

              {pending.map((w, i) => (
                <div key={w._id} style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr", padding:"16px 20px", alignItems:"center", borderBottom:i<pending.length-1?"1px solid #f0f0f0":"none" }}>
                  <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                    <div className="wb-avatar wb-avatar-sm">{initials(w.userId?.fullName)}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:"14px" }}>{w.userId?.fullName}</div>
                      <div style={{ fontSize:"12px", color:"#9ca3af" }}>{w.phone}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
                    {(w.services||[]).map(s => <span key={s} className="wb-chip" style={{ fontSize:"11px", padding:"2px 8px" }}>{SERVICE_EMOJI[s]||"🔧"} {s}</span>)}
                  </div>
                  <div style={{ fontSize:"14px" }}>{w.preferredCity}</div>
                  <div>
                    <span style={{ padding:"4px 10px", borderRadius:"999px", fontSize:"12px", fontWeight:700, background: w.daysWaiting>1?"#fee2e2":w.daysWaiting===1?"#fef9c3":"#dcfce7", color: w.daysWaiting>1?"#991b1b":w.daysWaiting===1?"#854d0e":"#166534" }}>
                      {w.daysWaiting}d waiting
                    </span>
                  </div>
                  <div>
                    <button onClick={() => setReviewing(w)} className="wb-btn wb-btn-dark wb-btn-sm">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── JOB STATS ── */}
        {activeTab === "jobs" && (
          <>
            <h1 style={{ margin:"0 0 24px", fontSize:"24px", fontWeight:800 }}>Job Statistics</h1>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
              {Object.entries(metrics.jobStats?.today||{}).map(([k,v]) => (
                <div key={k} style={{ background:"white", borderRadius:"14px", border:"1px solid #e5e5e5", padding:"24px", textAlign:"center" }}>
                  <div style={{ fontSize:"40px", fontWeight:900, color:"#1a1a1a", marginBottom:"8px" }}>{v}</div>
                  <div style={{ fontSize:"14px", fontWeight:700, color:"#374151" }}>{k}</div>
                  <div style={{ fontSize:"12px", color:"#9ca3af", marginTop:"4px" }}>Today</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Review Modal */}
      {reviewing && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
          <div style={{ background:"white", borderRadius:"20px", padding:"32px", width:"100%", maxWidth:"480px" }}>
            <h2 style={{ margin:"0 0 20px", fontWeight:800 }}>Review Worker Profile</h2>
            <div style={{ display:"flex", gap:"14px", alignItems:"center", background:"#f5f5f5", borderRadius:"12px", padding:"16px", marginBottom:"20px" }}>
              <div className="wb-avatar wb-avatar-md">{initials(reviewing.userId?.fullName)}</div>
              <div>
                <div style={{ fontWeight:700 }}>{reviewing.userId?.fullName}</div>
                <div style={{ fontSize:"13px", color:"#6b7280" }}>{reviewing.phone} · {reviewing.preferredCity}</div>
                <div style={{ fontSize:"13px", color:"#6b7280", marginTop:"4px" }}>Submitted: {reviewing.submittedAt}</div>
              </div>
            </div>
            <div style={{ marginBottom:"16px" }}>
              <div style={{ fontSize:"13px", color:"#6b7280", marginBottom:"8px" }}>Services Applied For:</div>
              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                {(reviewing.services||[]).map(s => <span key={s} className="wb-chip">{SERVICE_EMOJI[s]||"🔧"} {s}</span>)}
              </div>
            </div>

            {rejectId === reviewing._id ? (
              <>
                <div style={{ marginBottom:"16px" }}>
                  <label className="wb-label">Rejection Reason <span style={{color:"red"}}>*</span> (min 20 characters)</label>
                  <textarea className="wb-input" rows={4} value={rejectReason} onChange={e=>setRejectReason(e.target.value)}
                    placeholder="Explain why this profile cannot be approved..." style={{ resize:"vertical" }} />
                  <div style={{ fontSize:"12px", color: rejectReason.length<20?"#ef4444":"#9ca3af", marginTop:"4px" }}>{rejectReason.length}/20 minimum</div>
                </div>
                <div style={{ display:"flex", gap:"12px" }}>
                  <button onClick={() => setRejectId(null)} className="wb-btn wb-btn-outline-dark" style={{ flex:1, justifyContent:"center" }}>Back</button>
                  <button onClick={reject} disabled={rejectReason.length<20} className="wb-btn" style={{ flex:1, justifyContent:"center", background:"#dc2626", color:"white" }}>Confirm Rejection</button>
                </div>
              </>
            ) : (
              <div style={{ display:"flex", gap:"12px" }}>
                <button onClick={() => { setReviewing(null); setRejectId(null); }} className="wb-btn wb-btn-outline-dark" style={{ justifyContent:"center" }}>Close</button>
                <button onClick={() => { setRejectId(reviewing._id); }} className="wb-btn wb-btn-sm" style={{ flex:1, justifyContent:"center", background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca" }}>✕ Reject</button>
                <button onClick={() => approve(reviewing._id)} className="wb-btn wb-btn-dark" style={{ flex:1, justifyContent:"center" }}>✓ Approve</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Worker Modal */}
      {createWorker && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
          <div style={{ background:"white", borderRadius:"20px", padding:"32px", width:"100%", maxWidth:"480px" }}>
            <h2 style={{ margin:"0 0 20px", fontWeight:800 }}>Create Worker Account</h2>
            <p style={{ margin:"-12px 0 20px", color:"#6b7280", fontSize:"13px" }}>OTP verification is skipped for admin-created accounts.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <div><label className="wb-label">Full Name <span style={{color:"red"}}>*</span></label><input className="wb-input" value={newWorkerForm.fullName} onChange={e=>setNewWorkerForm(f=>({...f,fullName:e.target.value}))} /></div>
              <div><label className="wb-label">Phone (WhatsApp) <span style={{color:"red"}}>*</span></label><input className="wb-input" placeholder="03XX-XXXXXXX" value={newWorkerForm.phone} onChange={e=>setNewWorkerForm(f=>({...f,phone:e.target.value}))} /></div>
              <div><label className="wb-label">CNIC Number <span style={{color:"red"}}>*</span></label><input className="wb-input" placeholder="00000-0000000-0" value={newWorkerForm.cnicNumber} onChange={e=>setNewWorkerForm(f=>({...f,cnicNumber:e.target.value}))} /></div>
              <div><label className="wb-label">Preferred City</label>
                <select className="wb-input" value={newWorkerForm.preferredCity} onChange={e=>setNewWorkerForm(f=>({...f,preferredCity:e.target.value}))}>
                  {["Lahore","Karachi","Islamabad","Rawalpindi","Faisalabad","Multan"].map(c=><option key={c}>{c}</option>)}
                </select></div>
            </div>
            <div style={{ display:"flex", gap:"12px", marginTop:"20px" }}>
              <button onClick={() => setCreateWorker(false)} className="wb-btn wb-btn-outline-dark" style={{ flex:1, justifyContent:"center" }}>Cancel</button>
              <button onClick={async () => {
                try { await api.post("/admin/workers/create", newWorkerForm); alert("Worker account created!"); setCreateWorker(false); } catch(e) { alert(e.message || "Failed"); }
              }} className="wb-btn wb-btn-dark" style={{ flex:1, justifyContent:"center" }}>Create Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
