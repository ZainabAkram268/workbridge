import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X, LogOut, Home } from "lucide-react";
import { useAuth } from "../../hooks/useAuth"; // Ensure this path is correct for your project

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Destructure auth state and logout function
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setNavOpen(false);
    navigate("/"); // Redirect to landing page after logout
  };

  // Scroll effect for sticky navbar styling
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [navOpen]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-slate-200/60"
          : "bg-white/90 backdrop-blur-md py-4 border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO - Stays on the far left */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#7FFFD4] flex items-center justify-center text-[#1A2E35] font-bold text-2xl shadow-sm group-hover:scale-105 transition-transform">
            W
          </div>
          <span className="font-black text-2xl tracking-tight text-[#1A2E35]">
            WorkBridge
          </span>
        </Link>

        {/* RIGHT SIDE CONTAINER: Holds both Links and Auth Buttons */}
        <div className="hidden md:flex items-center ml-auto">
          
          {/* LANDING LINKS: Shows only when logged out, positioned near buttons */}
          {!user && (
            <div className="flex items-center gap-8 mr-10">
              {["How It Works", "Services", "FAQs"].map((link) => (
                <a 
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-[15px] font-semibold text-slate-600 hover:text-[#48CBB1] transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          )}

          {/* AUTH BUTTONS: Changes based on Login status */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Logged In: Show Home and Logout */}
                <Link
                  to="/"
                  className="flex items-center gap-2 text-[15px] font-bold text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-[15px] font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
                >
                  Logout
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {/* Logged Out: Show Login and Get Started */}
                <Link
                  to="/login"
                  className="text-[15px] font-bold text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register/employer"
                  className="flex items-center gap-2 bg-[#1A2E35] hover:bg-[#25414b] text-white text-[15px] font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-slate-200"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE OVERLAY MENU */}
      {navOpen && (
        <div className="absolute top-full inset-x-0 bg-white border-t border-slate-100 p-6 flex flex-col gap-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
          {!user && (
            <>
              <a href="#how-it-works" onClick={() => setNavOpen(false)} className="text-lg font-semibold text-slate-700">How It Works</a>
              <a href="#services" onClick={() => setNavOpen(false)} className="text-lg font-semibold text-slate-700">Services</a>
              <a href="#faqs" onClick={() => setNavOpen(false)} className="text-lg font-semibold text-slate-700">FAQs</a>
            </>
          )}
          
          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/" onClick={() => setNavOpen(false)} className="w-full text-center py-4 font-bold text-slate-700 border border-slate-200 rounded-xl">Home</Link>
                <button onClick={handleLogout} className="w-full text-center py-4 font-bold bg-red-50 text-red-600 rounded-xl">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setNavOpen(false)} className="w-full text-center py-4 font-bold text-slate-700 border border-slate-200 rounded-xl">Login</Link>
                <Link to="/register/employer" onClick={() => setNavOpen(false)} className="w-full text-center py-4 font-bold bg-[#1A2E35] text-white rounded-xl shadow-lg shadow-slate-200">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}