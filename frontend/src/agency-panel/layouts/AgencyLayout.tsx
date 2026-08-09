import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AgencyLayout — main authenticated shell for the Agency Panel.
 *
 * Future layout:
 *  - AgencyHeader (top bar) — always visible
 *  - AgencySidebar (desktop, left column)
 *  - AgencyBottomNav (mobile, fixed bottom)
 *  - <Outlet /> — page content
 *
 * Currently: renders <Outlet /> directly.
 * Sidebar and BottomNav will be wired when the first full module is built.
 */
export const AgencyLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] font-sans">
      {/* TODO: <AgencyHeader /> */}
      {/* TODO: <AgencySidebar /> on desktop */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* TODO: <AgencyBottomNav /> on mobile */}
    </div>
  );
};

export default AgencyLayout;
