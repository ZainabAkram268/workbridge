import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import {
  Shield, Mic, Zap, Star, ChevronDown, ChevronRight,
  ArrowRight, CheckCircle2, Users, Briefcase, TrendingUp,
  MapPin, Phone, Mail,
  Home as HomeIcon, Car, Leaf, Baby, ChefHat, Plug, Wrench, Eye,
  Award, Clock, HeartHandshake, BarChart3,
} from "lucide-react";

const SERVICES = [
  { Icon: HomeIcon,    label: "Domestic Helpers", sub: "Cleaning & housekeeping",  color: "bg-violet-50 text-violet-600" },
  { Icon: Car,         label: "Drivers",           sub: "Personal & professional",  color: "bg-sky-50 text-sky-600" },
  { Icon: Leaf,        label: "Gardeners",         sub: "Lawn care & landscaping",  color: "bg-emerald-50 text-emerald-600" },
  { Icon: Baby,        label: "Babysitters",        sub: "Trusted childcare",        color: "bg-pink-50 text-pink-600" },
  { Icon: ChefHat,     label: "Cooks",              sub: "Professional cooking",     color: "bg-amber-50 text-amber-600" },
  { Icon: Plug,        label: "Electricians",       sub: "Electrical repairs",       color: "bg-yellow-50 text-yellow-600" },
  { Icon: Wrench,      label: "Plumbers",           sub: "Plumbing services",        color: "bg-cyan-50 text-cyan-600" },
  { Icon: Eye,         label: "Security Guards",    sub: "Professional security",     color: "bg-slate-50 text-slate-600" },
];

const FEATURES = [
  { Icon: Shield,         title: "CNIC Verified",      desc: "Every worker is manually verified by our admin team within 48 hours.",    color: "text-violet-500", bg: "bg-violet-50" },
  { Icon: Mic,            title: "Urdu Voice Support",  desc: "Full Urdu audio navigation so every Pakistani can use WorkBridge.",       color: "text-emerald-500", bg: "bg-emerald-50" },
  { Icon: Zap,            title: "Real-Time Matching",  desc: "AI-powered matching connects the right worker to the right employer.",    color: "text-amber-500", bg: "bg-amber-50" },
  { Icon: HeartHandshake, title: "Free for Workers",    desc: "Registration, profiles, and job applications are 100% free for workers.", color: "text-sky-500", bg: "bg-sky-50" },
  { Icon: BarChart3,      title: "Transparent Ratings", desc: "5-star reviews and written feedback build community trust over time.",    color: "text-rose-500", bg: "bg-rose-50" },
  { Icon: Award,          title: "Dispute Resolution",  desc: "Our dedicated admin team mediates any employer-worker disputes.",         color: "text-teal-500", bg: "bg-teal-50" },
];

const STATS = [
  { value: "2,840+", label: "Active Workers",    Icon: Users },
  { value: "183",    label: "Jobs Today",        Icon: Briefcase },
  { value: "97%",    label: "Match Rate",        Icon: TrendingUp },
  { value: "4.9",    label: "Average Rating",    Icon: Star },
];

const TESTIMONIALS = [
  { initials: "AM", name: "Ali Mahmood",   role: "Driver · Lahore",    stars: 5, text: "WorkBridge gave me steady work and real respect. The Urdu voice feature makes it incredibly easy to navigate." },
  { initials: "SB", name: "Sara Baig",     role: "Employer · Karachi",  stars: 5, text: "Found a verified, background-checked driver in under 10 minutes. The rating system gives me full confidence." },
  { initials: "FA", name: "Fatima Asif",   role: "Employer · Islamabad", stars: 5, text: "CNIC verification makes me feel completely safe hiring domestic helpers. I won't use any other platform." },
];

const FAQS = [
  { q: "Is WorkBridge really free for workers?",  a: "Yes — registration, profile creation, and job applications are completely free for all workers. We only connect you with employers." },
  { q: "How does CNIC verification work?",         a: "Upload your CNIC front image during registration. Our admin team manually reviews and verifies each profile within 48 hours." },
  { q: "How do I use Urdu voice navigation?",      a: "Tap the speaker icon on any page to hear Urdu audio instructions for that screen — no reading required." },
  { q: "What happens if there's a dispute?",       a: "Our admin team mediates all disputes between workers and employers. Reach us anytime through the Help Center." },
  { q: "How are workers rated?",                   a: "Employers rate workers 1–5 stars with optional written feedback after each completed job." },
  { q: "What payment methods are accepted?",       a: "WorkBridge facilitates agreements; payments are made directly between employers and workers in any mutually agreed method." },
];

const EMP_STEPS = [
  { n: 1, Icon: Users,      label: "Register",   desc: "Sign up in 2 minutes with OTP verification" },
  { n: 2, Icon: Zap,        label: "Search",     desc: "Filter workers by service, location & date" },
  { n: 3, Icon: Briefcase,  label: "Book",       desc: "Send a request and get instant confirmation" },
  { n: 4, Icon: Star,       label: "Review",     desc: "Rate workers and build community trust" },
];
const WRK_STEPS = [
  { n: 1, Icon: Users,      label: "Create Profile",    desc: "Register with your CNIC and service details" },
  { n: 2, Icon: Shield,     label: "Get Verified",      desc: "Admin reviews and approves your profile" },
  { n: 3, Icon: Briefcase,  label: "Receive Requests",  desc: "Accept jobs that match your schedule" },
  { n: 4, Icon: TrendingUp, label: "Earn & Grow",       desc: "Build ratings and expand your opportunities" },
];

function useCountUp(target, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, "")) || 0;
    const steps = 40;
    const inc = num / steps;
    let c = 0, step = 0;
    const t = setInterval(() => {
      step++;
      c = Math.min(c + inc, num);
      setCount(c);
      if (step >= steps) clearInterval(t);
    }, duration / steps);
    return () => clearInterval(t);
  }, [start, target, duration]);
  return count;
}

function StatCard({ value, label, Icon, animate }) {
  const num = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const suffix = value.replace(/[0-9.,]/g, "");
  const count = useCountUp(value, 1400, animate);
  const display = animate
    ? (Number.isInteger(num) ? Math.round(count).toLocaleString() : count.toFixed(1)) + suffix
    : value;

  return (
    <div className="flex flex-col items-center gap-3 p-8">
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white/80" />
      </div>
      <div className="text-4xl font-black text-white tracking-tight">{display}</div>
      <div className="text-sm text-white/50 font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [howTab, setHowTab] = useState("employers");
  const [openFaq, setOpenFaq] = useState(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-white font-sans antialiased text-gray-900">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-5 pb-0 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-teal-50 blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-50 blur-3xl opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              Pakistan's #1 Verified Workers Platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Trusted Workers.<br />
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Verified Profiles.
              </span><br />
              Real Opportunities.
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              Connecting skilled workers with employers across Pakistan through CNIC-verified profiles, Urdu voice guidance, and real-time job matching.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button onClick={() => navigate("/register/employer")}
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-900/20">
                I Need Workers <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate("/register/worker")}
                className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-teal-400 hover:bg-teal-50 text-gray-800 font-semibold px-7 py-3.5 rounded-2xl transition-all hover:scale-[1.02]">
                I'm Looking for Work
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { Icon: Shield, text: "CNIC Verified" },
                { Icon: Mic,    text: "Urdu Support" },
                { Icon: Zap,    text: "Free for Workers" },
                { Icon: Clock,  text: "48hr Verification" },
              ].map(({ Icon: I, text }) => (
                <div key={text} className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3.5 py-2 rounded-xl shadow-sm">
                  <I className="w-3.5 h-3.5 text-teal-500" /> {text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-teal-100 to-violet-100 rounded-3xl blur-2xl opacity-40" />
            <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl shadow-gray-200/80 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Live Dashboard</p>
                  <h3 className="text-base font-bold">Today's Overview</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-gray-500 font-medium">Live</span>
                </div>
              </div>

              {[
                { label: "Active Workers",    value: "2,840",   sub: "+124 this week",  Icon: Users,      color: "bg-violet-50 text-violet-600",  bar: "bg-violet-400", pct: "78%" },
                { label: "Jobs Posted Today",  value: "183",     sub: "+22 vs yesterday", Icon: Briefcase,  color: "bg-sky-50 text-sky-600",         bar: "bg-sky-400",    pct: "54%" },
                { label: "Successful Matches", value: "97%",     sub: "Match rate",       Icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600", bar: "bg-emerald-400", pct: "97%" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                    <s.Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{s.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black tracking-tight">{s.value}</span>
                      <span className="text-xs text-emerald-600 font-semibold">{s.sub}</span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-gray-200 overflow-hidden">
                      <div className={`h-full rounded-full ${s.bar}`} style={{ width: s.pct, transition: "width 1s ease" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section ref={statsRef} className="bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-5xl mx-auto px-6 py-4 grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} animate={statsVisible} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">Why WorkBridge</p>
            <h2 className="text-4xl font-black tracking-tight mb-4">Built for Pakistan's Workforce</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">Every feature is designed with the unique needs of Pakistani workers and employers in mind.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ Icon: I, title, desc, color, bg }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 group">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <I className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-bold text-base mb-2 group-hover:text-teal-600 transition-colors">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl font-black tracking-tight mb-4">Getting Started is Simple</h2>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 rounded-2xl p-1">
              {[{id:"employers",l:"For Employers"},{id:"workers",l:"For Workers"}].map(t => (
                <button key={t.id} onClick={() => setHowTab(t.id)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${howTab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            {(howTab === "employers" ? EMP_STEPS : WRK_STEPS).map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gray-900 flex items-center justify-center mb-5 shadow-xl shadow-gray-900/20 relative z-10 hover:scale-105 transition-transform">
                  <s.Icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-black flex items-center justify-center shadow">
                    {s.n}
                  </div>
                </div>
                <h4 className="font-bold text-base mb-2">{s.label}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">Services</p>
              <h2 className="text-4xl font-black tracking-tight">What We Offer</h2>
            </div>
            <Link to="/employer/workers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              Browse all workers <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICES.map(({ Icon: I, label, sub, color }) => (
              <button key={label} onClick={() => navigate("/employer/workers")}
                className="group bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-md hover:shadow-gray-100 hover:-translate-y-1 hover:border-teal-200 transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <I className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-teal-600 transition-colors">{label}</h3>
                <p className="text-xs text-gray-400">{sub}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">Reviews</p>
            <h2 className="text-4xl font-black tracking-tight mb-4">What Our Community Says</h2>
            <div className="flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
              <span className="ml-2 text-sm font-semibold text-gray-600">4.9 out of 5 from 12,000+ users</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-100 transition-all hover:-translate-y-1 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" className="py-24 bg-gray-50/50 scroll-mt-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-black tracking-tight text-slate-800">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className={`bg-white rounded-2xl border transition-all duration-200 ${openFaq === i ? "border-teal-200 shadow-sm" : "border-gray-100"}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left">
                  <span className={`font-semibold text-sm transition-colors ${openFaq === i ? "text-teal-600" : "text-gray-800"}`}>{faq.q}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === i ? "bg-teal-50 text-teal-600" : "bg-gray-100 text-gray-400"}`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 -z-10" />
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-4">Get Started Today</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
            Join 600,000+ Pakistanis<br />Building Better Futures
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/worker" className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg text-sm">
              Sign Up as Worker — It's Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register/employer" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all text-sm">
              Hire Verified Workers
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-sm font-black">W</div>
                <span className="font-black text-lg text-white">WorkBridge</span>
              </div>
              <p className="text-gray-500 text-sm">Bridging Trust, Empowering Futures. Pakistan's trusted platform for informal workers.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-5">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-5">Support</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-5">Contact</h4>
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Lahore, Pakistan</div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@workbridge.pk</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex justify-between text-xs text-gray-600">
            <p>© 2024 WorkBridge Pakistan. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}