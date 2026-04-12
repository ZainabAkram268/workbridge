import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ role }) {
  const location = useLocation();
  const isChatPage = location.pathname.includes("chat");

  return (
    <div className="h-screen w-full bg-[#D1FFF3]/40 flex overflow-hidden font-sans antialiased text-slate-800">
      
      {/* 1. Only show Sidebar if NOT on chat page */}
      {!isChatPage && <Sidebar role={role} />}
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* 2. Only show Navbar if NOT on chat page */}
        {!isChatPage && <Navbar />}
        
        {/* 3. Main Content Area */}
        <main className={`flex-1 ${isChatPage ? "overflow-hidden p-0" : "overflow-y-auto p-8"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}