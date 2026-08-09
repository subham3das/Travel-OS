import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Super Admin 404 Page (Placeholder)
 * Route: /admin/*
 */
export const AdminNotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="space-y-3">
        <h1 className="text-4xl font-black text-slate-900">404</h1>
        <p className="text-sm font-bold text-slate-600">Admin Page Not Found</p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminNotFoundPage;
