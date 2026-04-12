import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ role }) {
  const location = useLocation();
  const isChatPage = location.pathname.includes("chat");

  return (
    <div className="h-screen w-full bg-[#D1FFF3]/40 flex flex-col overflow-hidden font-sans antialiased text-slate-800">
      
      {/* Navbar spans full width at the top */}
      {!isChatPage && <Navbar />}

      {/* Below navbar: sidebar + content side by side */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {!isChatPage && <Sidebar role={role} />}

        <main className={`flex-1 min-w-0 ${isChatPage ? "overflow-hidden p-0" : "overflow-y-auto p-8"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}