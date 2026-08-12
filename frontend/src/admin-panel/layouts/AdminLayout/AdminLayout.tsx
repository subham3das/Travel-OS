import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { AdminHeader } from '../../components/layout/AdminHeader';

export const AdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#F8F9FC] text-[#0F172A] font-sans select-none overflow-hidden flex">
      {/* ═══════════════════════════════════════════════════════════════════
          FIXED SIDEBAR — Desktop (md+)
          - position: fixed, left: 0, top: 0, height: 100vh
          - never moves when content scrolls
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block fixed top-0 left-0 h-screen z-40">
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE DRAWER SIDEBAR — (< md)
          - Overlay backdrop + animated slide-in drawer
          ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-72 max-w-[80vw] h-full bg-white shadow-2xl z-50"
            >
              <AdminSidebar
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
          - margin-left offsets the fixed sidebar on desktop
          - contains the sticky header + scrollable page content
          - this div is the ONLY scrollable element in the viewport
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        className={`flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden transition-[margin-left] duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* STICKY HEADER — sticks to top of this scroll container */}
        <AdminHeader onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)} />

        {/* SCROLLABLE DASHBOARD CONTENT — only this area moves when scrolling */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
