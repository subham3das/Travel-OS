import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';

export const AdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex font-sans select-none overflow-x-hidden">
      {/* ── SIDEBAR ── */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* ── MAIN WRAPPER ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* HEADER */}
        <AdminHeader />

        {/* PAGE CONTENT CONTAINER */}
        <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
