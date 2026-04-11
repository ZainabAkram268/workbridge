import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SERVICES = [
  { emoji:"🧹", label:"Domestic Helpers", sub:"Cleaning & housekeeping" },
  { emoji:"🚗", label:"Drivers",          sub:"Personal & professional" },
  { emoji:"🌱", label:"Gardeners",        sub:"Lawn care & landscaping" },
  { emoji:"👶", label:"Babysitters",      sub:"Trusted childcare" },
  { emoji:"👨‍🍳",label:"Cooks",            sub:"Professional cooking" },
  { emoji:"⚡", label:"Electricians",     sub:"Electrical repairs" },
  { emoji:"🔧", label:"Plumbers",         sub:"Plumbing services" },
  { emoji:"🛡️", label:"Security Guards",  sub:"Professional security" },
];

const FAQS = [
  { q:"Is WorkBridge really free for workers?", a:"Yes! Registration and profile creation is completely free for all workers. We only connect you with employers." },
  { q:"How does CNIC verification work?", a:"Upload your CNIC front image during registration. Our admin team manually reviews and verifies each profile within 48 hours." },
  { q:"How do I use Urdu voice navigation?", a:"Click the speaker icon on any page to hear Urdu audio instructions for that screen." },
  { q:"What happens if there's a dispute?", a:"Our admin team mediates disputes between workers and employers. Contact support through the help center." },
  { q:"How are workers rated?", a:"Employers can rate workers on a 1-5 star scale with optional written feedback after job completion." },
  { q:"What payment methods are accepted?", a:"Currently WorkBridge facilitates the agreement; payments are made directly between employers and workers." },
];

const TESTIMONIALS = [
  { initials:"AM", name:"Ali Mahmood",  role:"Driver, Lahore",     stars:5, text:'"WorkBridge gave me steady work and respect. The Urdu voice feature makes it so easy to use!"' },
  { initials:"SB", name:"Sara Baig",    role:"Employer, Karachi",  stars:5, text:'"Found a verified driver in 10 minutes. The rating system gives me real confidence in the workers."' },
  { initials:"FA", name:"Fatima Asif",  role:"Employer, Islamabad",stars:5, text:'"The CNIC verification makes me feel safe hiring domestic helpers for my home."' },
];

export default function Home() {
  const navigate = useNavigate();
  const [howTab, setHowTab]   = useState("employers");
  const [openFaq, setOpenFaq] = useState(null);

  const EMP_STEPS = [
    { n:1, label:"Register",  desc:"Sign up in 2 minutes with OTP verification" },
    { n:2, label:"Search",    desc:"Find workers by service, location, and date" },
    { n:3, label:"Book",      desc:"Send request & get instant confirmation" },
    { n:4, label:"Review",    desc:"Rate workers and build community trust" },
  ];
  const WRK_STEPS = [
    { n:1, label:"Create Profile",   desc:"Register with CNIC and service details" },
    { n:2, label:"Get Verified",     desc:"Admin reviews and approves your profile" },
    { n:3, label:"Receive Requests", desc:"Accept jobs that match your schedule" },
    { n:4, label:"Earn & Grow",      desc:"Build ratings and expand opportunities" },
  ];

  return (
    <div style={{ background:"white", fontFamily:"Inter, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav style={{ position:"sticky", top:0, zIndex:50, background:"white", borderBottom:"1px solid #f0f0f0", padding:"0 40px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          <span style={{ fontSize:"20px" }}>🌉</span>
          <span style={{ fontWeight:800, fontSize:"18px" }}>WorkBridge</span>
        </div>
        <div style={{ display:"flex", gap:"28px", alignItems:"center" }}>
          {["Find a Worker","How It Works","Services"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} style={{ fontSize:"14px", fontWeight:500, color:"#374151", textDecoration:"none" }}>{l}</a>
          ))}
          <Link to="/login" style={{ fontSize:"14px", fontWeight:600, color:"#374151", textDecoration:"none" }}>Login</Link>
          <Link to="/register/employer" className="wb-btn wb-btn-dark" style={{ textDecoration:"none", fontSize:"14px", minHeight:"40px", padding:"8px 20px" }}>Register</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding:"72px 40px 64px", maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px", alignItems:"center" }}>
        <div>
          <h1 style={{ margin:"0 0 20px", fontSize:"48px", fontWeight:900, lineHeight:1.1, color:"#1a1a1a" }}>
            Pakistan's Trusted<br />Platform for<br />
            <span style={{ color:"#2a9d8f" }}>Verified Workers</span> &amp;<br />
            <span style={{ color:"#2a9d8f" }}>Reliable Jobs</span>
          </h1>
          <p style={{ margin:"0 0 28px", fontSize:"16px", color:"#6b7280", lineHeight:1.7 }}>
            Connecting skilled workers with employers through CNIC-verified profiles, Urdu voice guidance, and real-time matching.
          </p>
          <div style={{ display:"flex", gap:"14px", marginBottom:"28px" }}>
            <button onClick={() => navigate("/register/employer")} className="wb-btn wb-btn-dark" style={{ fontSize:"15px" }}>
              I Need Workers
            </button>
            <button onClick={() => navigate("/register/worker")} className="wb-btn wb-btn-outline-dark" style={{ fontSize:"15px" }}>
              I'm Looking for Work
            </button>
          </div>
          <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
            {["✓ CNIC Verified","🗣️ Urdu Accessible","🆓 Free for Workers","⚡ Real-Time Matching"].map(b => (
              <span key={b} style={{ background:"#f5f5f5", color:"#374151", padding:"6px 14px", borderRadius:"999px", fontSize:"13px", fontWeight:500 }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Stats card */}
        <div style={{ background:"white", borderRadius:"20px", border:"1px solid #e5e5e5", padding:"28px", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
            <span style={{ fontWeight:700, fontSize:"15px" }}>Today's Overview</span>
            <div style={{ display:"flex", gap:"4px" }}>
              <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#e5e5e5" }} />
              <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#2a9d8f" }} />
            </div>
          </div>
          {[
            { label:"ACTIVE WORKERS",    value:"2,840", emoji:"👷", bg:"#fef9c3" },
            { label:"JOBS POSTED TODAY", value:"183",   emoji:"💼", bg:"#dbeafe" },
            { label:"MATCHES MADE",      value:"97%",   emoji:"✓",  bg:"#d6f5ef" },
          ].map(s => (
            <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px", borderRadius:"12px", background:"#f9fafb", marginBottom:"12px" }}>
              <div>
                <div style={{ fontSize:"11px", fontWeight:600, color:"#9ca3af", letterSpacing:"0.06em" }}>{s.label}</div>
                <div style={{ fontSize:"28px", fontWeight:900, marginTop:"2px" }}>{s.value}</div>
              </div>
              <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>{s.emoji}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding:"64px 40px", background:"#f9fafb" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"40px" }}>
            <div>
              <div className="wb-tag" style={{ marginBottom:"12px" }}>WHY CHOOSE US</div>
              <h2 style={{ margin:0, fontSize:"30px", fontWeight:800 }}>Why Choose WorkBridge Pakistan?</h2>
            </div>
            <p style={{ maxWidth:"320px", color:"#6b7280", fontSize:"14px", lineHeight:1.7, margin:0 }}>Trusted by thousands of workers and employers across Pakistan.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"20px" }}>
            {[
              { emoji:"👷", title:"For Workers", items:["Free Registration & Profile Creation","CNIC-Based Verification","Control Your Schedule","Direct Employer Connection","Fair Payment & Transparent Ratings"] },
              { emoji:"🏠", title:"For Employers", items:["Access Verified Workers","Search by Service & Location","Transparent Reviews & Ratings","Quick Booking & Real-Time Updates","Trusted Background Checks"] },
              { emoji:"🛡️", title:"Key Features", items:["Urdu Voice Navigation","Icon-Based Interface","Admin Verification","Dispute Resolution","Notification Alerts"] },
            ].map(card => (
              <div key={card.title} style={{ background:"white", borderRadius:"16px", padding:"28px", border:"1px solid #e5e5e5" }}>
                <div style={{ fontSize:"32px", marginBottom:"14px" }}>{card.emoji}</div>
                <h3 style={{ margin:"0 0 16px", fontSize:"17px", fontWeight:700 }}>{card.title}</h3>
                {card.items.map(item => (
                  <div key={item} style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"10px", fontSize:"14px", color:"#374151" }}>
                    <span style={{ color:"#2a9d8f", fontWeight:700 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:"64px 40px" }} id="how-it-works">
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"32px" }}>
            <div>
              <div className="wb-tag" style={{ marginBottom:"12px" }}>HOW IT WORKS</div>
              <h2 style={{ margin:0, fontSize:"30px", fontWeight:800 }}>Getting Started is Simple</h2>
            </div>
          </div>
          <div style={{ display:"flex", gap:"8px", marginBottom:"36px" }}>
            {[{id:"employers",l:"For Employers"},{id:"workers",l:"For Workers"}].map(t => (
              <button key={t.id} onClick={() => setHowTab(t.id)} style={{ padding:"10px 24px", borderRadius:"999px", border:"1.5px solid", fontWeight:600, fontSize:"14px", cursor:"pointer", background:howTab===t.id?"#1e1e1e":"white", color:howTab===t.id?"white":"#6b7280", borderColor:howTab===t.id?"#1e1e1e":"#e5e5e5" }}>{t.l}</button>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"20px" }}>
            {(howTab==="employers" ? EMP_STEPS : WRK_STEPS).map(s => (
              <div key={s.n} style={{ textAlign:"center" }}>
                <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:"#1e1e1e", color:"white", fontWeight:800, fontSize:"18px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>{s.n}</div>
                <h4 style={{ margin:"0 0 8px", fontWeight:700, fontSize:"15px" }}>{s.label}</h4>
                <p style={{ margin:0, fontSize:"13px", color:"#6b7280", lineHeight:1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ padding:"64px 40px", background:"#f9fafb" }} id="services">
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"32px" }}>
            <div>
              <div className="wb-tag" style={{ marginBottom:"12px" }}>SERVICES</div>
              <h2 style={{ margin:0, fontSize:"30px", fontWeight:800 }}>Services Available</h2>
            </div>
            <Link to="/employer/workers" style={{ fontWeight:600, fontSize:"14px", color:"#2a9d8f", textDecoration:"none" }}>Find a Worker →</Link>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px" }}>
            {SERVICES.map(s => (
              <div key={s.label} onClick={() => navigate("/employer/workers")} style={{ background:"white", borderRadius:"14px", border:"1px solid #e5e5e5", padding:"28px 20px", textAlign:"center", cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="#2a9d8f"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="#e5e5e5"}>
                <div style={{ fontSize:"36px", marginBottom:"12px" }}>{s.emoji}</div>
                <div style={{ fontWeight:700, fontSize:"14px", marginBottom:"4px" }}>{s.label}</div>
                <div style={{ fontSize:"12px", color:"#9ca3af" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section style={{ background:"#1e1e1e", padding:"48px 40px" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"20px", textAlign:"center" }}>
          {[["12K+","Happy Companies"],["600K+","Active Users"],["99.9%","Uptime SLA"],["4.9★","User Rating"]].map(([v,l]) => (
            <div key={l}>
              <div style={{ fontSize:"40px", fontWeight:900, color:"#5ecfb8", marginBottom:"6px" }}>{v}</div>
              <div style={{ fontSize:"14px", color:"#9ca3af" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ padding:"64px 40px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"32px" }}>
            <div>
              <div className="wb-tag" style={{ marginBottom:"12px" }}>REVIEWS</div>
              <h2 style={{ margin:0, fontSize:"30px", fontWeight:800 }}>What Our Community Says</h2>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background:"white", borderRadius:"16px", border:"1px solid #e5e5e5", padding:"24px" }}>
                <div style={{ color:"#f59e0b", fontSize:"16px", marginBottom:"12px" }}>{"★".repeat(t.stars)}</div>
                <p style={{ margin:"0 0 20px", fontSize:"14px", color:"#374151", lineHeight:1.7, fontStyle:"italic" }}>{t.text}</p>
                <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                  <div className="wb-avatar wb-avatar-sm">{t.initials}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:"14px" }}>{t.name}</div>
                    <div style={{ fontSize:"12px", color:"#6b7280" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:"64px 40px", background:"#f9fafb" }}>
        <div style={{ maxWidth:"720px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <div className="wb-tag" style={{ marginBottom:"12px" }}>FAQ</div>
            <h2 style={{ margin:0, fontSize:"30px", fontWeight:800 }}>Frequently Asked Questions</h2>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom:"1px solid #e5e5e5" }}>
              <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 0", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                <span style={{ fontWeight:600, fontSize:"15px", color:"#1a1a1a" }}>{faq.q}</span>
                <span style={{ color:"#6b7280", fontSize:"20px", flexShrink:0, marginLeft:"16px" }}>{openFaq===i?"−":"+"}</span>
              </button>
              {openFaq===i && <p style={{ margin:"0 0 16px", fontSize:"14px", color:"#6b7280", lineHeight:1.7 }}>{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:"#1e1e1e", padding:"72px 40px", textAlign:"center" }}>
        <h2 style={{ margin:"0 0 14px", fontSize:"36px", fontWeight:900, color:"white" }}>Ready to Get Started?</h2>
        <p style={{ margin:"0 0 32px", color:"#9ca3af", fontSize:"16px" }}>Join thousands of workers and employers building trust together</p>
        <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
          <Link to="/register/worker" className="wb-btn wb-btn-teal" style={{ textDecoration:"none", fontSize:"15px" }}>Sign Up as Worker</Link>
          <Link to="/register/employer" className="wb-btn" style={{ textDecoration:"none", fontSize:"15px", background:"white", color:"#1e1e1e", border:"none" }}>Sign Up as Employer</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#111", padding:"48px 40px 28px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1.5fr", gap:"40px", marginBottom:"40px" }}>
            <div>
              <div style={{ fontWeight:800, fontSize:"18px", color:"white", marginBottom:"10px" }}>WorkBridge</div>
              <p style={{ color:"#6b7280", fontSize:"13px", lineHeight:1.7, margin:"0 0 16px" }}>Bridging Trust, Empowering Futures.<br />Pakistan's trusted platform for informal workers.</p>
            </div>
            {[
              { title:"Quick Links", items:["About Us","How It Works","Services","Pricing","Blog"] },
              { title:"Support",     items:["Help Center","FAQs","Contact Support","Report Issue","Terms & Conditions"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontWeight:700, fontSize:"13px", color:"white", marginBottom:"16px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{col.title}</div>
                {col.items.map(item => <div key={item} style={{ color:"#6b7280", fontSize:"13px", marginBottom:"10px", cursor:"pointer" }}>{item}</div>)}
              </div>
            ))}
            <div>
              <div style={{ fontWeight:700, fontSize:"13px", color:"white", marginBottom:"16px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Contact</div>
              <div style={{ color:"#6b7280", fontSize:"13px", lineHeight:1.8 }}>
                📍 Lahore, Pakistan<br />📞 +92 300-0000000<br />✉️ support@workbridge.pk
              </div>
            </div>
          </div>
          <div style={{ borderTop:"1px solid #222", paddingTop:"20px", textAlign:"center", color:"#4b5563", fontSize:"12px" }}>
            © 2024 WorkBridge Pakistan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
