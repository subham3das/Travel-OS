import React from 'react';
import { motion } from 'framer-motion';
import { Database, Download, Upload, ShieldCheck, FileSpreadsheet, Users } from 'lucide-react';

export const DataManagementCard: React.FC = () => {
  const handleExport = (type: string) => {
    alert(`Exporting ${type} CSV report... Download will start shortly.`);
  };

  const handleBackup = () => {
    alert('Full Agency Backup archive generated & saved securely!');
  };

  const handleRestore = () => {
    alert('Select JSON/ZIP backup file to initiate data restoration process.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Database className="w-5 h-5 text-sky-600" />
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Data Management</h3>
          <p className="text-[11px] font-semibold text-slate-400">Export agency datasets, create full backups & data restoration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <button
          type="button"
          onClick={() => handleExport('Complete Agency Data')}
          className="p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-800 font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-sky-600" />
          <span>Export Agency Data</span>
        </button>

        <button
          type="button"
          onClick={() => handleExport('Bookings Records')}
          className="p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-100 text-[#583BE8] font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#583BE8]" />
          <span>Export Bookings</span>
        </button>

        <button
          type="button"
          onClick={() => handleExport('Travelers Roster')}
          className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Export Travelers</span>
        </button>

        <button
          type="button"
          onClick={handleBackup}
          className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-900 font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Backup Data</span>
        </button>

        <button
          type="button"
          onClick={handleRestore}
          className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer col-span-1 sm:col-span-2"
        >
          <Upload className="w-4 h-4 text-slate-600" />
          <span>Restore Data</span>
        </button>
      </div>
    </motion.div>
  );
};

export default DataManagementCard;
